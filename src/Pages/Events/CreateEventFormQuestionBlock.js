/* eslint-disable camelcase -- SCEvents registration question shape uses snake_case */
import React from 'react';

export default function CreateEventFormQuestionBlock({
  question,
  index,
  onUpdateField,
  onChangeType,
  onRemove,
  onUpdateAnswerOption,
  onAddAnswerOption,
  onRemoveAnswerOption,
}) {
  return (
    <div className="p-4 mb-3 border border-gray-200 rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex flex-wrap flex-1 gap-2 items-center">
          <span className="flex justify-center items-center w-6 h-6 text-xs font-medium rounded-full bg-primary/15 text-primary">
            {index + 1}
          </span>
          <select
            value={question.type}
            onChange={(e) => onChangeType(question.id, e.target.value)}
            className="text-sm select select-bordered select-sm dark:bg-gray-700"
          >
            <option value="textbox">Text input</option>
            <option value="multiple_choice">Multiple choice</option>
            <option value="dropdown">Dropdown</option>
            <option value="checkbox">Checkbox</option>
          </select>
          <label className="flex gap-2 items-center text-sm cursor-pointer label">
            <input
              type="checkbox"
              checked={!!question.required}
              onChange={(e) => onUpdateField(question.id, 'required', e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="label-text">Required</span>
          </label>
        </div>
        <button
          type="button"
          className="btn btn-outline btn-sm shrink-0"
          onClick={() => onRemove(question.id)}
        >
          Remove
        </button>
      </div>

      <label className="w-full mt-3 form-control">
        <div className="label">
          <span className="label-text">Question text</span>
        </div>
        <input
          type="text"
          className="w-full text-sm input input-bordered sm:text-base"
          value={question.question}
          onChange={(e) => onUpdateField(question.id, 'question', e.target.value)}
          placeholder="Question"
        />
      </label>

      {question.type === 'textbox' && (
        <div className="flex gap-2 items-center mt-2 text-sm">
          <span className="text-gray-500 dark:text-gray-400">Max characters</span>
          <input
            type="number"
            min="1"
            className="w-24 input input-bordered input-sm"
            value={question.answer_details?.max_chars ?? ''}
            onChange={(e) =>
              onUpdateField(question.id, 'answer_details', {
                max_chars: e.target.value ? parseInt(e.target.value, 10) : undefined,
              })
            }
            placeholder="None"
          />
        </div>
      )}

      {(question.type === 'multiple_choice' || question.type === 'dropdown' || question.type === 'checkbox') && (
        <div className="mt-3 space-y-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Answer options</span>
          {(question.answer_options || []).map((option, optIndex) => (
            <div key={`${question.id}-opt-${optIndex}`} className="flex gap-2 items-center">
              <input
                type="text"
                className="flex-1 text-sm input input-bordered input-sm"
                value={option}
                onChange={(e) => onUpdateAnswerOption(question.id, optIndex, e.target.value)}
                placeholder={`Option ${optIndex + 1}`}
              />
              {(question.answer_options || []).length > 1 && (
                <button
                  type="button"
                  className="btn btn-outline btn-sm btn-square"
                  onClick={() => onRemoveAnswerOption(question.id, optIndex)}
                  aria-label="Remove option"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="w-full btn btn-outline btn-sm"
            onClick={() => onAddAnswerOption(question.id)}
          >
            Add option
          </button>
        </div>
      )}
    </div>
  );
}
