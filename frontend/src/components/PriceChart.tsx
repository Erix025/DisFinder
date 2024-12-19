import React, { useEffect } from 'react';
import Chart, { Props } from 'react-apexcharts';
import { json } from 'stream/consumers';

const state: Props['series'] = [
    {
        name: 'Series1',
        data: [31, 40, 28, 51, 42],
    },
    {
        name: 'Series2',
        data: [11, 32, 45, 32, 34],
    },
];

export const default_options: Props['options'] = {
    chart: {
        type: 'area',
        animations: {
            easing: 'linear',
            speed: 300,
        },
        sparkline: {
            enabled: false,
        },
        brush: {
            enabled: false,
        },
        id: 'basic-bar',
        fontFamily: 'Inter, sans-serif',
        foreColor: 'var(--nextui-colors-accents9)',
        stacked: false,
        toolbar: {
            show: false,
        },
    },

    xaxis: {
        categories: ["1 day ago", "2 days ago", "3 days ago", "4 days ago", "5 days ago"],
        labels: {
            // show: false,
            style: {
                colors: 'var(--nextui-colors-accents8)',
                fontFamily: 'Inter, sans-serif',
            },
        },
        axisBorder: {
            color: 'var(--nextui-colors-border)',
        },
        axisTicks: {
            color: 'var(--nextui-colors-border)',
        },
    },
    yaxis: {
        labels: {
            style: {
                colors: 'var(--nextui-colors-accents8)',
                fontFamily: 'Inter, sans-serif',
            },
        },
    },
    tooltip: {
        enabled: false,
    },
    grid: {
        show: true,
        borderColor: 'var(--nextui-colors-border)',
        strokeDashArray: 0,
        position: 'back',
    },
    stroke: {
        curve: 'smooth',
        fill: {
            colors: ['red'],
        },
    },
    // @ts-ignore
    markers: false,
};
export interface SteamProps {
    options?: Props['options'];
    series: Props['series'];
}



export const Steam = (props: SteamProps) => {
    const { options = default_options, series } = props;



    useEffect(() => {
        console.log("[chart]series", series);
        console.log("[chart]options", options);
    }, [options, series]);

    return (
        <>
            <div id="chart">
                <Chart
                    key={JSON.stringify(series) + JSON.stringify(options)}
                    options={options}
                    series={series}
                    type="area"
                    height={425}
                />
            </div>
        </>
    );
};
