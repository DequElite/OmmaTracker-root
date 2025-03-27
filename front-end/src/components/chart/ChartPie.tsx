import { Doughnut } from 'react-chartjs-2';  
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'; 

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ChartPie({progress, width=10, height=10, border=50, fontSize=15}:{progress:number, width?:number, height?:number, border?:number, fontSize?:number}){
    const ChartData = {
        labels: ['Completed', 'In process'],
        datasets: [
            {
                data: [progress, 100 - progress],  
                backgroundColor: ['#0015FF', '#FF0000'],  
                borderWidth: 0,  
            },
        ],
    }

    const ChartOptions = {
        responsive: true, 
        cutout:`${border}%`,
        plugins: {
            tooltip: {
                enabled: true, 
            },
            legend: {
                display: false,  
            },
            datalabels: {
                display: true,  
                align: 'center',  
                color: '#1f1f1f',  
                font: {
                    weight: 'bold',
                    size: 1, 
                },
                formatter: (value:number) => `${Math.round(value)}%`,  
            },
        },
    }

    return (
        <div style={{ width: `${width}vh`, height: `${height}vh` }} className="relative">
          <Doughnut data={ChartData} options={ChartOptions} />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              fontSize: `${fontSize}px`,
              fontWeight: 'bold',
            }}
          >
            {progress}%  
          </div>
        </div>
      );
}