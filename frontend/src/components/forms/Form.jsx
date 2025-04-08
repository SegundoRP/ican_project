import { Input } from '@/components/forms';
import { Spinner } from '@/components/common';

export default function Form({ config, isLoading, btnText, onChange, onSubmit }) {
  return(
    <form className="space-y-6" onSubmit={onSubmit}>
      {config.map(input => (
        <Input
          key={input.labelId}
          labelId={input.labelId}
          type={input.type}
          onChange={onChange}
          value={input.value}
          link={input.link}
          required={input.required}
        >
          {input.labelText}
        </Input>
      ))}

      <div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          disabled={isLoading}
        >
          {isLoading ? <Spinner sm /> : `${btnText}`}
        </button>
      </div>
    </form>
  )
}
