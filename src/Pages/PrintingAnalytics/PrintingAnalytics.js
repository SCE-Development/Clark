import React, { useState, useEffect } from 'react';
import { getAllLogs } from '../../APIFunctions/2DPrinting';
import './PrintingAnalytics.css';
import { Line, Pie } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Analytics() {
  const [printLogs, setPrintLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const PieChartData = [
    {
      numPages: 1,
      chosenPrinter: 'right',
      printedDate: new Date().toISOString(),
      memberName: 'Bobby',
      status: 'success'
    },
    {
      numPages: 2,
      chosenPrinter: 'right',
      printedDate: new Date().toISOString(),
      memberName: 'Jacky',
      status: 'success'
    },
    {
      numPages: 3,
      chosenPrinter: 'right',
      printedDate: new Date().toISOString(),
      memberName: 'Jonathon',
      status: 'fail'
    },
    {
      numPages: 4,
      chosenPrinter: 'left',
      printedDate: new Date().toISOString(),
      memberName: 'Ramsey',
      status: 'success'
    },
    {
      numPages: 5,
      chosenPrinter: 'left',
      printedDate: new Date().toISOString(),
      memberName: 'Will',
      status: 'fail'
    },
    {
      numPages: 6,
      chosenPrinter: 'left',
      printedDate: new Date().toISOString(),
      memberName: 'Jack',
      status: 'fail'
    }
  ];

  const lineGraphInfo = {
    labels: ['8:00', '8:30', '9:00', '9:30', '10:00', '10:30', '11:00',
      '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
      '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00',
      '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'],
    datasets: [
      {
        label: 'Number of print requests',
        fill: false,
        lineTension: 0.5,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 2,
        pointHitRadius: 10,
        data: filterTime()
      }
    ]
  };

  const PieChartInfo = {
    labels: [
      'Left printer',
      'Right printer',
      'Failed prints'
    ],
    datasets: [{
      data: filterStatus(),
      backgroundColor: [
        '#228B22',
        '#32CD32',
        '#CC0000'
      ],
      hoverBackgroundColor: [
        '#228B22',
        '#32CD32',
        '#CC0000'
      ]
    }]
  };

  useEffect(() => {
    async function fetchPrintLogs() {
      const fetchedLogs = await getAllLogs();
      setPrintLogs(fetchedLogs.data);
    }
    fetchPrintLogs();
  }, []);

  function filterTime() {
    let count = new Array(28);
    for (let i = 0; i < count.length; i++) {
      count[i] = 0;
    }

    for (let i = 0; i < printLogs.length; i++) {
      let dateAndTime = printLogs[i].printedDate.split('T');
      if (dateAndTime[0] === selectedDate.toISOString().split('T')[0]) {
      // if (dateAndTime[0] === '1970-01-01') {
        let time = dateAndTime[1].split(':');
        let hour = parseInt(time[0]);
        let minute = parseInt(time[1]);
        if (minute < 30) {
          count[(hour - 8) * 2] += 1;
        } else {
          count[((hour - 8) * 2) + 1] += 1;
        }
      }
    }

    return count;
  }

  function filterStatus() {
    let count = new Array(3);
    for (let i = 0; i < count.length; i++) {
      count[i] = 0;
    }

    for (let i = 0; i < PieChartData.length; i++) {
      if (PieChartData[i].status === 'fail') {
        count[2] += 1;
        continue;
      }

      let chosenPrinter = PieChartData[i].chosenPrinter;
      chosenPrinter === 'left' ? count[0] += 1 : count[1] += 1;
    }

    return count;
  }

  return (
    <React.Fragment>
      <div className='date-picker-compartment'>
        <div className='select-date-text'><p>Select Date:</p></div>
        <div>
          <DatePicker
            className='date-picker'
            selected={selectedDate}
            onChange={date => setSelectedDate(date)}
            peekNextMonth
            showMonthDropdown
            showYearDropdown
            dropdownMode='select'
          />
        </div>
      </div>
      <div className='graph-compartment'>
        <Line
          data={lineGraphInfo}
          options={{responsive: true, maintainAspectRatio: true}}
          redraw
        />
        <Pie data={PieChartInfo} />
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Member name</th>
              <th>Pages printed</th>
              <th>Destination</th>
              <th>Date printed</th>
            </tr>
          </thead>
          <tbody>
            { printLogs.map((log, i) => (
              <tr key={log._id}>
                <td>{i}</td>
                <td>{log.memberName}</td>
                <td>{log.numPages}</td>
                <td>{log.chosenPrinter}</td>
                <td>{log.printedDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </React.Fragment>
  );
}
