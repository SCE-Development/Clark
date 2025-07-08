const LastNameFilter = ({ lastNameFilter, setLastNameFilter }) => {
  return (
    <div>
      <label className='block text-sm font-medium text-gray-300 mb-2'>Filter by Last Name</label>
      <input
        type='text'
        value={lastNameFilter}
        onChange={e => setLastNameFilter(e.target.value)}
        placeholder='Enter last name...'
        className='w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
      />
    </div>
  );
};

export default LastNameFilter;
