'use client';

export default function CondominiumSelector({
  register,
  condominiums,
  loading,
  errors,
  required = false
}) {
  return (
    <div>
      <label htmlFor="condominium" className="block text-sm font-medium text-gray-700 mb-1">
        Condominium {required && <span className="text-red-500">*</span>}
      </label>

      <select
        id="condominium"
        {...register('condominium', {
          required: required ? 'Please select a condominium' : false
        })}
        disabled={loading}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
      >
        <option value="">
          {loading ? 'Loading condominiums...' : 'Select a condominium'}
        </option>
        {condominiums?.map((condo) => (
          <option key={condo.id} value={condo.id}>
            {condo.name} - {condo.district}
          </option>
        ))}
      </select>

      {errors.condominium && (
        <p className="text-red-500 text-xs mt-1">{errors.condominium.message}</p>
      )}

      <p className="text-xs text-gray-500 mt-1">
        Select the condominium where you live
      </p>
    </div>
  );
}
