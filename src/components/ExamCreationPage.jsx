import { useState } from "react";
import AddExam from "./AddExam";
import AddTestType from "./AddTestType";
import AddExamTopics from "./AddExamTopics";

const ExamCreationPage = () => {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="w-full">
      <div className="w-full">
        {step === 1 && <AddExam onNext={nextStep} />}
        {step === 2 && <AddExamTopics onNext={nextStep} onBack={prevStep} />}
        {step === 3 && <AddTestType onBack={prevStep} />}
      </div>
    </div>
  );
};

export default ExamCreationPage;
