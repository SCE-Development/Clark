export function EventListening({ messages }) {
        const headings = [
          'Time'.padEnd(29),
          'Endpoint'.padEnd(38),
          'Method'.padEnd(8),
          'Code'.padEnd(7),
          'Event'.padEnd(21),
          'Alias'.padEnd(15)
        ].join('');


    return (
      <>
        <h2 className='text-center text-lg'>Recent Events</h2>
        <hr className="border-t-2 border-grey my-4" />
        <pre className='text-sm'>{headings}</pre>
        <pre className='text-sm'>
            {messages.join('\n')}
        </pre>
      </>
    );
  }
