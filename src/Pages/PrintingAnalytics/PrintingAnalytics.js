import React, { useState, useEffect } from 'react';
import { getAllLogs } from '../../APIFunctions/2DPrinting';
import './PrintingAnalytics.css';
import { Line, Pie } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Header from '../../Components/Header/Header';
import { Label } from 'reactstrap';

export default function Analytics() {
  const [printLogs, setPrintLogs] = useState([]);
  const [filteredPrintLogs, setFilteredPrintLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    async function fetchPrintLogs() {
      const fetchedLogs = await getAllLogs();
      setPrintLogs(fetchedLogs.responseData);
    }
    fetchPrintLogs();
  }, []);

  // Filter the print logs to only get logs in selected date
  useEffect(() => {
    let targetDate = selectedDate
      .toLocaleString('en-US', { hour12: false })
      .split(',')[0];

    let filteredPrintLogs = printLogs.filter(printLog => {
      let dateAndTime = new Date(printLog.printedDate)
        .toLocaleString('en-US', { hour12: false })
        .split(',');

      return dateAndTime[0] === targetDate;
    });

    setFilteredPrintLogs(filteredPrintLogs);
  }, [selectedDate, printLogs]);

  const headerProps = {
    title: 'Printing Analytics'
  };

  function getRequestCounts() {
    let count = new Array(28);
    for (let i = 0; i < count.length; i++) {
      count[i] = 0;
    }

    for (let i = 0; i < filteredPrintLogs.length; i++) {
      let dateAndTime = new Date(filteredPrintLogs[i].printedDate)
        .toLocaleString('en-US', { hour12: false })
        .split(',');
      let time = dateAndTime[1].split(':');
      let hour = parseInt(time[0].trim());
      let minute = parseInt(time[1]);

      // Only count requests made from [8, 22)
      if (hour >= 8 && hour <= 21) {
        if (minute < 30) {
          count[(hour - 8) * 2] += 1;
        } else {
          count[((hour - 8) * 2) + 1] += 1;
        }
      }
    }

    return count;
  }

  function getPrinterCounts() {
    let count = new Array(3);
    for (let i = 0; i < count.length; i++) {
      count[i] = 0;
    }

    for (let i = 0; i < filteredPrintLogs.length; i++) {
      let chosenPrinter = filteredPrintLogs[i].chosenPrinter;
      if (chosenPrinter === 'Fail') {
        count[2] += 1;
        continue;
      }
      chosenPrinter.split('-')[3] === 'left' ? count[0] += 1 : count[1] += 1;
    }

    return count;
  }

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
        data: getRequestCounts()
      }
    ]
  };

  const pieChartInfo = {
    labels: [
      'Left printer',
      'Right printer',
      'Failed prints'
    ],
    datasets: [{
      data: getPrinterCounts(),
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

  return (
    <React.Fragment>
      <Header {...headerProps} />
      <div className='date-picker-component'>
        <Label for='date-select'>Select Date: </Label>
        <DatePicker
          className='date-picker'
          selected={selectedDate}
          onChange={date => setSelectedDate(date)}
          peekNextMonth
          showMonthDropdown
          showYearDropdown
          dropdownMode='select'
          id='date-select'
        />
      </div>
      <div className='visualizations'>
        <div className='line-graph'>
          <Line
            data={lineGraphInfo}
            options={{ responsive: true, maintainAspectRatio: true }}
            redraw
          />
        </div>
        <div className='pie-chart'>
          <Pie
            data={pieChartInfo}
            redraw
          />
        </div>
      </div>
      <div className='table-component'>
        <div className='table-scroll'>
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
              {filteredPrintLogs.map((log, i) => (
                <tr key={log._id}>
                  <td>{i + 1}</td>
                  <td>{log.memberName}</td>
                  <td>{log.numPages}</td>
                  <td>{log.chosenPrinter}</td>
                  <td>{
                    new Date(log.printedDate)
                      .toLocaleString('en-US', { hour12: false })
                  }</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </React.Fragment>
  );
}
