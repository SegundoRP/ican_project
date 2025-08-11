'use client';

export default function DepartmentSelector({
  register,
  departments,
  loading,
  errors,
  required = false
}) {
  // Group departments by tower for better organization
  const groupedDepartments = departments?.reduce((acc, dept) => {
    const tower = dept.tower || 'Unknown';
    if (!acc[tower]) {
      acc[tower] = [];
    }
    acc[tower].push(dept);
    return acc;
  }, {});

  return (
    <div>
      <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
        Department {required && <span className="text-red-500">*</span>}
      </label>

      <select
        id="department"
        {...register('department', {
          required: required ? 'Please select your department' : false
        })}
        disabled={loading || !departments?.length}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
      >
        <option value="">
          {loading ? 'Loading departments...' :
           !departments?.length ? 'Select a condominium first' :
           'Select your department'}
        </option>

        {groupedDepartments && Object.entries(groupedDepartments).map(([tower, depts]) => (
          <optgroup key={tower} label={`Tower ${tower}`}>
            {depts.sort((a, b) => a.floor - b.floor).map((dept) => (
              <option key={dept.id} value={dept.id}>
                Floor {dept.floor} - {dept.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>

      {errors.department && (
        <p className="text-red-500 text-xs mt-1">{errors.department.message}</p>
      )}

      <p className="text-xs text-gray-500 mt-1">
        Select your apartment/department number
      </p>
    </div>
  );
}
