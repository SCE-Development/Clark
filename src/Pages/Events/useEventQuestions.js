import { useState } from 'react';

export function newQuestionTemplate() {
  return {
    id: crypto.randomUUID(),
    type: 'textbox',
    question: '',
    required: false,
    answer_details: { max_chars: 200 },
  };
}

export function toApiRegistrationForm(questions) {
  return questions.map((q) => {
    const base = {
      id: q.id,
      type: q.type,
      question: q.question,
      required: !!q.required,
    };

    if (q.type === 'textbox' && q.answer_details?.max_chars) {
      base.answer_details = { max_chars: q.answer_details.max_chars };
    }

    if (['multiple_choice', 'dropdown', 'checkbox'].includes(q.type)) {
      base.answer_options = Array.isArray(q.answer_options)
        ? q.answer_options.map((opt) => String(opt).trim()).filter(Boolean)
        : [];
    }

    return base;
  });
}

export function useEventQuestions(initialQuestions = []) {
  const [questions, setQuestions] = useState(initialQuestions);

  function addQuestion() {
    setQuestions((prev) => [...prev, newQuestionTemplate()]);
  }

  function removeQuestion(id) {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }

  function updateQuestion(id, field, value) {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  }

  function updateQuestionType(id, newType) {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== id) return q;

        const updated = { ...q, type: newType };

        if (newType === 'textbox') {
          updated.answer_details = { max_chars: 200 };
          delete updated.answer_options;
        } else if (['multiple_choice', 'dropdown', 'checkbox'].includes(newType)) {
          if (!updated.answer_options) {
            updated.answer_options = ['Option 1', 'Option 2'];
          }
          delete updated.answer_details;
        }
        return updated;
      })
    );
  }

  function updateAnswerOption(questionId, optionIndex, value) {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;
        const newOptions = [...(q.answer_options || [])];
        newOptions[optionIndex] = value;
        return { ...q, answer_options: newOptions };
      })
    );
  }

  function addAnswerOption(questionId) {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;
        const newOptions = [...(q.answer_options || [])];
        newOptions.push(`Option ${newOptions.length + 1}`);
        return { ...q, answer_options: newOptions };
      })
    );
  }

  function removeAnswerOption(questionId, optionIndex) {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== questionId) return q;
        const newOptions = [...(q.answer_options || [])];
        newOptions.splice(optionIndex, 1);
        return { ...q, answer_options: newOptions };
      })
    );
  }

  return {
    questions,
    setQuestions,
    addQuestion,
    removeQuestion,
    updateQuestion,
    updateQuestionType,
    updateAnswerOption,
    addAnswerOption,
    removeAnswerOption
  };
}
