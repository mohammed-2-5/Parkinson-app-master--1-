const Prediction = require("../models/prediction");

// الأعراض المعروفة
const knownSymptoms = [
  { _id: "functionalAssessment", name: "Functional Assessment" },
  { _id: "moca", name: "MoCA" },
  { _id: "tremor", name: "Tremor" },
  { _id: "rigidity", name: "Rigidity" },
  { _id: "bradykinesia", name: "Bradykinesia" },
  { _id: "alcoholConsumption", name: "Alcohol Consumption" },
  { _id: "age", name: "Age" },
  { _id: "bmi", name: "BMI" },
  { _id: "sleepQuality", name: "Sleep Quality" },
  { _id: "dietQuality", name: "Diet Quality" },
  { _id: "cholesterolTriglycerides", name: "Cholesterol Triglycerides" },
  { _id: "updrs", name: "UPDRS" },
];

// إنشاء التنبؤ الجديد
const createPrediction = async (req, res) => {
  try {
    const { userId, inputType, predictedResult } = req.body;
    let symptoms = req.body.symptoms;

    const image = req.file ? req.file.path : null;

    // التحقق من وجود userId
    if (!userId) {
      return res.status(400).json({ message: "UserId is required" });
    }

    // التحقق من inputType
    if (!["symptoms", "image"].includes(inputType)) {
      return res.status(400).json({
        message: "Invalid inputType. It should be 'symptoms' or 'image'.",
      });
    }

    // إذا كان النوع symptoms لازم يتم إرسال أعراض
    if (inputType === "symptoms") {
      if (!symptoms) {
        return res.status(400).json({
          message: "Symptoms must be provided when inputType is 'symptoms'",
        });
      }

      // لو symptoms جاية كـ string (من form-data)، نحولها لـ JSON
      if (typeof symptoms === "string") {
        symptoms = JSON.parse(symptoms);
      }

      if (!Array.isArray(symptoms) || symptoms.length === 0) {
        return res.status(400).json({
          message: "Symptoms must be a non-empty array.",
        });
      }
    }

    // إذا كان النوع image لازم يتم إرسال صورة
    if (inputType === "image" && !image) {
      return res.status(400).json({
        message: "Image must be provided when inputType is 'image'.",
      });
    }

    // تنسيق الأعراض
    let formattedSymptoms = [];

    if (inputType === "symptoms") {
      symptoms.forEach((symptom, index) => {
        const value = symptom.value;

        if (value === 0 || value === 1) {
          formattedSymptoms.push({
            _id: knownSymptoms[index]._id,
            name: knownSymptoms[index].name,
            value: value === 1,
          });
        } else if (typeof value === "number") {
          formattedSymptoms.push({
            _id: knownSymptoms[index]._id,
            name: knownSymptoms[index].name,
            value: value,
          });
        } else {
          return res.status(400).json({
            message:
              "Invalid symptom value. It should be a number (0, 1, float, or integer).",
          });
        }
      });
    }

    // إنشاء التنبؤ
    const newPrediction = new Prediction({
      userId,
      inputType,
      symptoms: inputType === "symptoms" ? formattedSymptoms : null,
      image: inputType === "image" ? image : null,
      predictedResult,
    });

    await newPrediction.save();
    res.status(201).json(newPrediction);
  } catch (error) {
    console.error("Error creating prediction:", error);
    res.status(500).json({
      message: "Error creating prediction",
      error: error.message,
    });
  }
};

module.exports = {
  createPrediction,
};
