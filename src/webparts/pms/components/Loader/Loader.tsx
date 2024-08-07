/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as React from "react";
import "./Loader.css";

const Loader = (): any => {
  return (
    <div className="container">
      <div className="logo">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 201 147"
          width="201"
          height="147"
        >
          <g
            fill="None"
            fillOpacity="0.0"
            stroke="#F7FDFC"
            strokeOpacity="1.00"
            strokeWidth="0.3"
          >
            <path
              d="
        M 0.00 20.00 
        C 2.90 4.39 32.06 2.72 35.78 17.22 C 39.49 31.73 44.03 48.53 59.70 53.30 C 75.36 58.08 96.72 54.90 98.00 75.00 C 99.28 95.11 72.24 99.28 64.25 86.75 C 56.25 74.23 57.63 56.11 42.25 48.75 C 26.87 41.40 7.83 48.87 0.00 31.00
        L 0.00 147.00
        L 88.00 147.00
        C 66.76 139.08 75.52 111.05 94.67 109.67 C 113.82 108.29 127.97 87.16 125.00 69.00 C 122.03 50.84 105.25 35.49 85.00 38.00 C 64.75 40.51 56.59 6.57 78.00 0.00
        L 0.00 0.00
        L 0.00 20.00 Z"
              className="svg-elem-1"
            />
          </g>

          <g
            fill="None"
            fillOpacity="0.0"
            stroke="#F7FDFC"
            strokeOpacity="1.00"
            strokeWidth="0.3"
          >
            <path
              d="
        M 201.00 35.00 
        L 201.00 0.00
        L 89.00 0.00
        C 107.99 8.59 99.38 30.79 117.25 42.75 C 135.13 54.70 144.88 31.99 156.92 19.92 C 168.95 7.85 196.34 18.05 201.00 35.00 Z"
              className="svg-elem-3"
            />
          </g>

          <g
            fill="None"
            fillOpacity="0.0"
            stroke="#F7FDFC"
            strokeOpacity="1.00"
            strokeWidth="0.3"
          >
            <path
              d="
        M 101.00 147.00 
        L 201.00 147.00
        L 201.00 38.00
        C 182.33 32.07 174.01 48.18 172.78 62.78 C 171.55 77.37 158.17 85.67 145.68 87.68 C 133.19 89.68 119.58 96.98 115.99 109.99 C 112.40 123.00 115.69 140.16 101.00 147.00 Z"
              className="svg-elem-5"
            />
          </g>
          <g fill="#F7FDFC" fillOpacity="1.00" stroke="None">
            <path
              d="
        M 0.00 20.00 
        C 2.90 4.39 32.06 2.72 35.78 17.22 C 39.49 31.73 44.03 48.53 59.70 53.30 C 75.36 58.08 96.72 54.90 98.00 75.00 C 99.28 95.11 72.24 99.28 64.25 86.75 C 56.25 74.23 57.63 56.11 42.25 48.75 C 26.87 41.40 7.83 48.87 0.00 31.00
        L 0.00 147.00
        L 88.00 147.00
        C 66.76 139.08 75.52 111.05 94.67 109.67 C 113.82 108.29 127.97 87.16 125.00 69.00 C 122.03 50.84 105.25 35.49 85.00 38.00 C 64.75 40.51 56.59 6.57 78.00 0.00
        L 0.00 0.00
        L 0.00 20.00 Z"
              className="svg-elem-6"
            />
          </g>
          <g fill="#33D8AE" fillOpacity="1.00" stroke="None">
            <path
              d="
        M 88.00 147.00 
        L 101.00 147.00
        C 115.69 140.16 112.40 123.00 115.99 109.99 C 119.58 96.98 133.19 89.68 145.68 87.68 C 158.17 85.67 171.55 77.37 172.78 62.78 C 174.01 48.18 182.33 32.07 201.00 38.00
        L 201.00 35.00
        C 196.34 18.05 168.95 7.85 156.92 19.92 C 144.88 31.99 135.13 54.70 117.25 42.75 C 99.38 30.79 107.99 8.59 89.00 0.00
        L 78.00 0.00
        C 56.59 6.57 64.75 40.51 85.00 38.00 C 105.25 35.49 122.03 50.84 125.00 69.00 C 127.97 87.16 113.82 108.29 94.67 109.67 C 75.52 111.05 66.76 139.08 88.00 147.00 Z"
              className="svg-elem-7"
            />
          </g>
          <g fill="#F7FDFC" fillOpacity="1.00" stroke="None">
            <path
              d="
        M 201.00 35.00 
        L 201.00 0.00
        L 89.00 0.00
        C 107.99 8.59 99.38 30.79 117.25 42.75 C 135.13 54.70 144.88 31.99 156.92 19.92 C 168.95 7.85 196.34 18.05 201.00 35.00 Z"
              className="svg-elem-8"
            />
          </g>
          <g fill="#33D8AE" fillOpacity="1.00" stroke="None">
            <path
              d="
        M 0.00 20.00 
        L 0.00 31.00
        C 7.83 48.87 26.87 41.40 42.25 48.75 C 57.63 56.11 56.25 74.23 64.25 86.75 C 72.24 99.28 99.28 95.11 98.00 75.00 C 96.72 54.90 75.36 58.08 59.70 53.30 C 44.03 48.53 39.49 31.73 35.78 17.22 C 32.06 2.72 2.90 4.39 0.00 20.00 Z"
              className="svg-elem-9"
            />
          </g>
          <g fill="#F7FDFC" fillOpacity="1.00" stroke="None">
            <path
              d="
        M 101.00 147.00 
        L 201.00 147.00
        L 201.00 38.00
        C 182.33 32.07 174.01 48.18 172.78 62.78 C 171.55 77.37 158.17 85.67 145.68 87.68 C 133.19 89.68 119.58 96.98 115.99 109.99 C 112.40 123.00 115.69 140.16 101.00 147.00 Z"
              className="svg-elem-10"
            />
          </g>
        </svg>
      </div>
    </div>
  );
};
export default Loader;
