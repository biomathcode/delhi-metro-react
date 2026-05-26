import React, { forwardRef } from 'react';


export interface MapTransform {
    scaleX: number;
    scaleY: number;
    translateX: number;
    translateY: number;
}

export interface MapControls {
    transform: MapTransform;
    isDragging: boolean;
    dragStart: (event: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => void;
    dragMove: (event: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => void;
    dragEnd: () => void;
    zoomAt: (scale: number, event: React.MouseEvent<SVGSVGElement>) => void;
    wheelZoom: (event: React.WheelEvent<SVGSVGElement>) => void;
}

interface MapProps {
    style: React.CSSProperties;
    ref?: React.RefObject<SVGSVGElement>;
    zoomFunction: MapControls;
    train: React.ReactNode;
}

const transformToString = ({ scaleX, scaleY, translateX, translateY }: MapTransform) =>
    `matrix(${scaleX} 0 0 ${scaleY} ${translateX} ${translateY})`;

const SvgComponent = forwardRef<SVGSVGElement, MapProps>(
    ({ style, zoomFunction, train }: MapProps, ref) => (
        <svg
            xmlns='http://www.w3.org/2000/svg'
            // style={{
            //   width: '100%',
            //   height: '100%',
            // }}
            viewBox='0 0 1500 1450'
            preserveAspectRatio='xMidYMid meet'
            ref={ref}
            style={style}
            onTouchStart={zoomFunction.dragStart}
            onTouchMove={zoomFunction.dragMove}
            onTouchEnd={zoomFunction.dragEnd}
            onMouseDown={zoomFunction.dragStart}
            onMouseMove={zoomFunction.dragMove}
            onMouseUp={zoomFunction.dragEnd}
            onMouseLeave={zoomFunction.dragEnd}
            onWheel={zoomFunction.wheelZoom}
            onDoubleClick={(event) => zoomFunction.zoomAt(1.18, event)}
        >
            <g transform={transformToString(zoomFunction.transform)}>
                <g
                    className='river'
                    style={{
                        transform: 'scale(.3) translate(230px)',
                    }}
                >
                    <path
                        fill='none'
                        stroke='#c1e8f7'
                        strokeWidth={60}
                        d='M1776 43q750 723 1334 1462a481.9 481.9 90 0 1 46 257c12 165 46 301 115 446q83 118 193 214l283 269q69 76 860 850'
                    />
                    <text transform='rotate(45 656.005 2585.056)'>Yamuna</text>
                </g>
                <g fill='none' strokeWidth={4} className='lines'>
                    <path
                        stroke='#c1282b'
                        d='m491.463 201.805-16.358-16.325M510.912 220.853l-19.449-19.048M532.694 236.072l-21.782-15.219M603.105 312.448l-70.411-76.376M677.886 384.356l-74.781-71.908M691.543 401.126l-13.657-16.77M702.033 411.713l-10.49-10.587M728.359 430.696l-26.326-18.983M757.441 443.669l-29.082-12.973M793.802 443.669h-36.361M828.036 443.669h-34.234M866.544 443.669h-38.508M886.482 443.669h-19.938M1017.952 443.669h-131.47M1062.015 415.087l-44.063 28.582M1093.082 385.549l-31.067 29.538M1138.369 349.275l-45.287 36.274M1170.738 317.004l-32.369 32.271M1203.118 284.744l-32.38 32.26M1235.486 252.473l-32.368 32.271M1267.866 220.213l-32.38 32.26M1300.245 187.942l-32.379 32.271M1332.614 155.682l-32.369 32.26M1364.993 123.411l-32.379 32.271M1397.373 91.151l-32.38 32.26M1429.741 58.88l-32.368 32.271M1462.121 26.62l-32.38 32.26M1488.09 1.085l-25.969 25.535'
                        className='line'
                    />

                    <path
                        stroke='#f5d618'
                        d='m603.246 106.261-52.675-52.805M672.484 172.04l-69.238-65.779M708.585 211.871l-36.101-39.831M748.427 252.169l-39.842-40.298M794.952 294.051l-46.525-41.882M820.703 324.446l-25.751-30.395M839.925 344.069l-19.222-19.623M857.975 361.685l-18.05-17.616M876.394 380.527l-18.419-18.842M888.641 405.584l-12.247-25.057M886.482 443.669l2.159-38.085M886.482 475.246v-31.577M886.482 494.989v-19.743M886.482 506.194v-11.205M886.482 545.624v-39.43M886.482 611.761v-66.137M886.482 683.386v-71.625M886.482 720.723v-37.337M886.482 745.726v-25.003M886.482 763.863v-18.137M886.482 800.419v-36.556M886.482 862.683v-62.264M837.43 907.938l49.052-45.255M774.461 961.427l62.969-53.489M774.461 989.283v-27.856M774.461 1016.531v-27.248M774.461 1043.791v-27.26M774.461 1072.678v-28.887M774.461 1104.45v-31.772M774.461 1123.324v-18.874M774.461 1142.209v-18.885M774.461 1161.073v-18.864M774.461 1186.857v-25.784M774.461 1231.679v-44.822M774.461 1297.468v-65.789M774.461 1363.247v-65.779'
                        className='line'
                    />

                    <path
                        stroke='#3e77bc'
                        d='M413.72 1248.698v62.948M413.72 1190.806v57.892M413.72 1132.913v57.893M413.72 1076.387v56.526M413.72 1017.117v59.27M413.72 959.225v57.892M413.72 901.332v57.893M413.72 835.499v65.833M413.72 785.536v49.963M413.72 727.644v57.892M413.72 669.751v57.893M413.72 611.848v57.903M433.939 571.495l-20.219 40.353M460.982 562.21l-27.043 9.285M495.509 553.738l-34.527 8.472M528.626 553.738h-33.117M564 553.738h-35.374M624.17 553.738H564M657.244 553.738H624.17M672.192 553.738h-14.948M699.972 553.738h-27.78M724.758 553.738h-24.786M741.083 553.738h-16.325M767.725 553.738h-26.642M785.102 553.738h-17.377M817.276 553.738h-32.174M843.255 553.738h-25.979M886.862 553.738h-43.607M930.566 553.738h-43.704M961.991 553.738h-31.425M989.088 568.057l-27.097-14.319M1010.674 581.431l-21.586-13.374M1034.44 598.126l-23.766-16.695M1080.217 638.825l-45.777-40.699M1117.043 667.853l-36.826-29.028M1128.357 684.08l-11.314-16.227M1150.573 705.884l-22.216-21.804M1173.689 727.839l-23.116-21.955M1196.522 749.284l-22.833-21.445M1218.195 769.525l-21.673-20.241M1236.3 781.783l-18.105-12.258M1279.114 827.266l-42.814-45.483M1310.594 857.042l-31.48-29.776M1342.062 886.818l-31.468-29.776M1373.541 916.594l-31.479-29.776M1405.02 946.37l-31.479-29.776M1436.488 976.147l-31.468-29.777M1467.968 1005.923l-31.48-29.776M1498.915 1034.983l-30.947-29.06M1071.463 571.159l-37.023 26.967M1095.088 548.369l-23.625 22.79M1118.052 525.925l-22.964 22.444M1142.133 499.436l-24.081 26.489M1180.566 466.297l-38.433 33.139M1237.037 411.236l-56.471 55.061M1303 347.583l-65.963 63.653'
                        className='line'
                    />
                    <path
                        stroke='#52aa55'
                        d='M33.692 494.435H1.085M66.299 494.435H33.692M98.907 494.435H66.299M131.503 494.435H98.907M164.11 494.435h-32.607M196.718 494.435H164.11M229.325 494.435h-32.607M261.921 494.435h-32.596M294.529 494.435h-32.608M327.136 494.435h-32.607M359.743 494.435h-32.607M392.35 494.435h-32.607M442.921 494.435H392.35M472.751 494.435h-29.83M510.424 494.435h-37.673M544.594 494.435h-34.17M574.305 494.435h-29.711M625.407 494.435h-51.102M658.112 494.435h-32.705M688.04 494.435h-29.928M695.34 519.58l-7.3-25.145M699.972 553.738l-4.632-34.158M728.359 430.696l-40.319 63.739'
                        className='line'
                    />
                    <path
                        stroke='#8115ff'
                        d='m961.991 458.042-75.509-14.373M961.991 479.607v-21.565M961.991 492.96v-13.353M961.991 530.991V492.96M961.991 553.738v-22.747M961.991 636.59v-82.852M884.226 683.386l77.765-46.796M905.866 730.605l-21.64-47.219M956.621 738.936l-50.755-8.331M965.408 763.245l-8.787-24.309M965.408 789.658v-26.413M964.941 829.739l.467-40.081M965.256 870.677l-.315-40.938M965.581 913.655l-.325-42.978M967.545 962.696l-1.964-49.041M965.408 992.635l2.137-29.939M965.408 1014.384v-21.749M965.408 1036.144v-21.76M965.408 1057.893v-21.749M965.408 1079.642v-21.749M965.408 1093.288v-13.646M965.408 1123.151v-29.863M965.408 1144.91v-21.759M965.408 1166.659v-21.749M965.408 1188.408v-21.749M965.408 1210.168v-21.76M965.408 1231.917v-21.749M965.408 1253.666v-21.749M965.408 1275.426v-21.76M965.408 1297.175v-21.749M965.408 1318.935v-21.76M965.408 1340.684v-21.749M965.408 1362.433v-21.749'
                        className='line'
                    />
                    <path
                        stroke='#e692be'
                        d='m794.952 294.051 44.539-12.116M739.695 333.85l55.257-39.799M677.886 384.356l61.809-50.506M656.268 431.737l21.618-47.381M625.407 494.435l30.861-62.698M626.893 534.289l-1.486-39.854M627.424 553.738l-.531-19.449M638.077 609.732l-10.653-55.994M661.8 669.523l-23.723-59.791M701.111 723.76 661.8 669.523M761.422 770.534l-60.311-46.774M789.257 783.931l-27.835-13.397M817.286 794.29l-28.029-10.359M856.163 801.71l-38.877-7.42M886.482 800.419l-30.319 1.291M921.682 801.829l-35.2-1.41M965.408 789.658l-43.726 12.171M1010.533 774.114l-45.125 15.544M1049.052 749.284l-38.519 24.83M1075.671 721.417l-26.619 27.867M1117.043 667.853l-41.372 53.564M1125.494 650.649l-8.451 17.204M1134.725 626.177l-9.231 24.472M1141.873 598.809l-7.148 27.368M1146.483 563.305l-4.61 35.504M1146.483 530.991v32.314M1180.566 466.297l-34.083 64.694M1142.133 499.436l38.433-33.139M1137.274 474.411l4.859 25.025M1125.927 441.153l11.347 33.258M1110.882 411.485l15.045 29.668M1093.082 383.792l17.8 27.693M1095.522 302.794l-2.44 80.998M1095.522 246.876v55.918M1095.522 190.947v55.929M1095.522 135.028v55.919M1095.522 79.099v55.929'
                        className='line'
                    />
                    <path
                        stroke='#F0F'
                        d='m441.012 618.757-7.073-47.262M458.802 689.081l-17.79-70.324M490.476 759.296l-31.674-70.215M537.695 824.5l-47.219-65.204M595.956 878.694 537.695 824.5M664.837 926.259l-68.881-47.565M686.673 935.903l-21.836-9.644M709.485 945.025l-22.812-9.122M732.492 953.551l-23.007-8.526M755.695 960.266l-23.203-6.715M774.461 961.427l-18.766-1.161M813.392 970.397l-38.931-8.97M856.63 974.389l-43.238-3.992M911.138 973.652l-54.508.737M939.005 970.777l-27.867 2.875M967.545 962.696l-28.54 8.081M995.054 959.442l-27.509 3.254M1037.912 945.047l-42.858 14.395M1082.82 925.76l-44.908 19.287M1126.209 900.03l-43.389 25.73M1163.883 871.871l-37.674 28.159M1195.698 841.997l-31.815 29.874M1224.91 809.411l-29.212 32.586M1236.3 781.783l-11.39 27.628'
                        className='line'
                    />
                    <path
                        stroke='#d4d4d6'
                        d='M381.178 835.499h32.542M359.483 835.499h21.695M337.788 835.499h21.695M761.422 770.534l-27.541 13.939'
                        className='line'
                    />
                    <path
                        stroke='#eb8923'
                        d='m813.555 647.297 73.307-141.103M733.881 784.473l79.674-137.176M641.7 944.103l92.181-159.63M555.539 1094.145 641.7 944.103M413.72 1311.646l141.819-217.501M339.957 1420.12l73.763-108.474'
                        className='line'
                    />
                    <path
                        stroke='#015b97'
                        d='M626.144 1186.857h92.355M636.048 1122.673l-9.904 64.184M646.223 1085.456l-10.175 37.217M704.191 1102.551l14.308 84.306M704.191 1102.551l-57.968-17.095M774.461 1186.857h-55.962M814.227 1186.857h-39.766M884.345 1186.857h-70.118M884.345 1263.158v-76.301M884.345 1312.796v-49.638M884.345 1362.433v-49.637'
                        className='line'
                    />
                </g>
                <g className='interchanges'>
                    <rect
                        width={8}
                        height={16}
                        x={673.886}
                        y={376.356}
                        fill='#fff'
                        stroke='#c1282b'
                        strokeWidth={1.333}
                        className='interchange'
                        rx={4}
                        style={{
                            cursor: 'pointer',
                        }}
                    />
                    <rect
                        width={8}
                        height={16}
                        x={724.359}
                        y={422.696}
                        fill='#fff'
                        stroke='#c1282b'
                        strokeWidth={1.333}
                        className='interchange'
                        rx={4}
                        style={{
                            cursor: 'pointer',
                        }}
                    />
                    <rect
                        width={8}
                        height={16}
                        x={882.482}
                        y={435.669}
                        fill='#fff'
                        stroke='#c1282b'
                        strokeWidth={1.333}
                        className='interchange'
                        rx={4}
                        style={{
                            cursor: 'pointer',
                        }}
                    />
                    <rect
                        width={8}
                        height={16}
                        x={1089.082}
                        y={375.792}
                        fill='#fff'
                        stroke='#c1282b'
                        strokeWidth={1.333}
                        className='interchange'
                        rx={4}
                        style={{
                            cursor: 'pointer',
                        }}
                    />
                    <rect
                        width={8}
                        height={16}
                        x={790.952}
                        y={286.051}
                        fill='#fff'
                        stroke='#f5d618'
                        strokeWidth={1.333}
                        className='interchange'
                        rx={4}
                        style={{
                            cursor: 'pointer',
                        }}
                    />
                    <rect
                        width={8}
                        height={16}
                        x={882.862}
                        y={498.194}
                        fill='#fff'
                        stroke='#f5d618'
                        strokeWidth={1.333}
                        className='interchange'
                        rx={4}
                        style={{
                            cursor: 'pointer',
                        }}
                    />
                    <rect
                        width={8}
                        height={16}
                        x={882.862}
                        y={545.738}
                        fill='#fff'
                        stroke='#f5d618'
                        strokeWidth={1.333}
                        className='interchange'
                        rx={4}
                        style={{
                            cursor: 'pointer',
                        }}
                    />
                    <rect
                        width={8}
                        height={16}
                        x={880.226}
                        y={675.386}
                        fill='#fff'
                        stroke='#f5d618'
                        strokeWidth={1.333}
                        className='interchange'
                        rx={4}
                        style={{
                            cursor: 'pointer',
                        }}
                    />
                    <rect
                        width={8}
                        height={16}
                        x={882.482}
                        y={792.419}
                        fill='#fff'
                        stroke='#f5d618'
                        strokeWidth={1.333}
                        className='interchange'
                        rx={4}
                        style={{
                            cursor: 'pointer',
                        }}
                    />
                    <rect
                        width={8}
                        height={16}
                        x={770.461}
                        y={953.427}
                        fill='#fff'
                        stroke='#f5d618'
                        strokeWidth={1.333}
                        className='interchange'
                        rx={4}
                        style={{
                            cursor: 'pointer',
                        }}
                    />
                    <rect
                        width={8}
                        height={16}
                        x={770.461}
                        y={1178.857}
                        fill='#fff'
                        stroke='#f5d618'
                        strokeWidth={1.333}
                        className='interchange'
                        rx={4}
                        style={{
                            cursor: 'pointer',
                        }}
                    />
                    <rect
                        width={8}
                        height={16}
                        x={409.72}
                        y={1303.646}
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        className='interchange'
                        rx={4}
                        style={{
                            cursor: 'pointer',
                        }}
                    />
                    <rect
                        width={8}
                        height={16}
                        x={409.72}
                        y={827.499}
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        className='interchange'
                        rx={4}
                        style={{
                            cursor: 'pointer',
                        }}
                    />
                    <rect
                        width={8}
                        height={16}
                        x={429.939}
                        y={563.495}
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        className='interchange'
                        rx={4}
                        style={{
                            cursor: 'pointer',
                        }}
                    />
                    <rect
                        width={8}
                        height={16}
                        x={623.424}
                        y={545.738}
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        className='interchange'
                        rx={4}
                        style={{
                            cursor: 'pointer',
                        }}
                    />
                    <rect
                        width={8}
                        height={16}
                        x={695.972}
                        y={545.738}
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        className='interchange'
                        rx={4}
                        style={{
                            cursor: 'pointer',
                        }}
                    />
                    <rect
                        width={8}
                        height={16}
                        x={957.991}
                        y={545.738}
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        className='interchange'
                        rx={4}
                        style={{
                            cursor: 'pointer',
                        }}
                    />
                    <rect
                        width={8}
                        height={16}
                        x={1030.44}
                        y={590.126}
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        className='interchange'
                        rx={4}
                        style={{
                            cursor: 'pointer',
                        }}
                    />
                    <rect
                        width={8}
                        height={16}
                        x={1113.043}
                        y={659.853}
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        className='interchange'
                        rx={4}
                        style={{
                            cursor: 'pointer',
                        }}
                    />
                    <rect
                        width={8}
                        height={16}
                        x={1232.3}
                        y={773.783}
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        className='interchange'
                        rx={4}
                        style={{
                            cursor: 'pointer',
                        }}
                    />
                    <rect
                        width={8}
                        height={16}
                        x={1138.133}
                        y={491.436}
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        className='interchange'
                        rx={4}
                        style={{
                            cursor: 'pointer',
                        }}
                    />
                    <rect
                        width={8}
                        height={16}
                        x={1176.566}
                        y={458.297}
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        className='interchange'
                        rx={4}
                        style={{
                            cursor: 'pointer',
                        }}
                    />
                    <rect
                        width={8}
                        height={16}
                        x={621.407}
                        y={486.435}
                        fill='#fff'
                        stroke='#52aa55'
                        strokeWidth={1.333}
                        className='interchange'
                        rx={4}
                        style={{
                            cursor: 'pointer',
                        }}
                    />
                    <rect
                        width={8}
                        height={16}
                        x={961.408}
                        y={781.658}
                        fill='#fff'
                        stroke='#8115ff'
                        strokeWidth={1.333}
                        className='interchange'
                        rx={4}
                        style={{
                            cursor: 'pointer',
                        }}
                    />
                    <rect
                        width={8}
                        height={16}
                        x={963.545}
                        y={954.696}
                        fill='#fff'
                        stroke='#8115ff'
                        strokeWidth={1.333}
                        className='interchange'
                        rx={4}
                        style={{
                            cursor: 'pointer',
                        }}
                    />
                </g>
                <g className='transferStations'>
                    <path
                        fill='#fff'
                        stroke='#c1282b'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='transferStation'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(475.105 185.48)'
                    />
                    <path
                        fill='#fff'
                        stroke='#c1282b'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='transferStation'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1488.09 1.085)'
                    />
                    <path
                        fill='#fff'
                        stroke='#f5d618'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='transferStation'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(550.57 53.456)'
                    />
                    <path
                        fill='#fff'
                        stroke='#f5d618'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='transferStation'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(774.46 1363.247)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='transferStation'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1498.915 1034.983)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='transferStation'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1303 347.583)'
                    />
                    <path
                        fill='#fff'
                        stroke='#52aa55'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='transferStation'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1.085 494.435)'
                    />
                    <path
                        fill='#fff'
                        stroke='#8115ff'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='transferStation'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(965.408 1362.433)'
                    />
                    <path
                        fill='#fff'
                        stroke='#e692be'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='transferStation'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(839.491 281.935)'
                    />
                    <path
                        fill='#fff'
                        stroke='#e692be'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='transferStation'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1095.522 79.1)'
                    />
                    <path
                        fill='#fff'
                        stroke='#d4d4d6'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='transferStation'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(337.788 835.5)'
                    />
                    <path
                        fill='#fff'
                        stroke='#d4d4d6'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='transferStation'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(733.88 784.473)'
                    />
                    <path
                        fill='#fff'
                        stroke='#eb8923'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='transferStation'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(339.957 1420.12)'
                    />
                    <path
                        fill='#fff'
                        stroke='#015b97'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='transferStation'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(718.5 1186.857)'
                    />
                    <path
                        fill='#fff'
                        stroke='#015b97'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='transferStation'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(884.345 1362.433)'
                    />
                </g>
                <g className='stations'>
                    <path
                        fill='#fff'
                        stroke='#c1282b'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(491.463 201.805)'
                    />
                    <path
                        fill='#fff'
                        stroke='#c1282b'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(510.912 220.853)'
                    />
                    <path
                        fill='#fff'
                        stroke='#c1282b'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(532.694 236.072)'
                    />
                    <path
                        fill='#fff'
                        stroke='#c1282b'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(603.105 312.448)'
                    />
                    <path
                        fill='#fff'
                        stroke='#c1282b'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(691.543 401.126)'
                    />
                    <path
                        fill='#fff'
                        stroke='#c1282b'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(702.033 411.713)'
                    />
                    <path
                        fill='#fff'
                        stroke='#c1282b'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(757.441 443.67)'
                    />
                    <path
                        fill='#fff'
                        stroke='#c1282b'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(793.802 443.67)'
                    />
                    <path
                        fill='#fff'
                        stroke='#c1282b'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(828.036 443.67)'
                    />
                    <path
                        fill='#fff'
                        stroke='#c1282b'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(866.544 443.67)'
                    />
                    <path
                        fill='#fff'
                        stroke='#c1282b'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1017.952 443.67)'
                    />
                    <path
                        fill='#fff'
                        stroke='#c1282b'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1062.015 415.087)'
                    />
                    <path
                        fill='#fff'
                        stroke='#c1282b'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1138.37 349.275)'
                    />
                    <path
                        fill='#fff'
                        stroke='#c1282b'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1170.738 317.004)'
                    />
                    <path
                        fill='#fff'
                        stroke='#c1282b'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1203.118 284.744)'
                    />
                    <path
                        fill='#fff'
                        stroke='#c1282b'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1235.486 252.473)'
                    />
                    <path
                        fill='#fff'
                        stroke='#c1282b'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1267.866 220.213)'
                    />
                    <path
                        fill='#fff'
                        stroke='#c1282b'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1300.245 187.942)'
                    />
                    <path
                        fill='#fff'
                        stroke='#c1282b'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1332.614 155.682)'
                    />
                    <path
                        fill='#fff'
                        stroke='#c1282b'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1364.993 123.41)'
                    />
                    <path
                        fill='#fff'
                        stroke='#c1282b'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1397.373 91.15)'
                    />
                    <path
                        fill='#fff'
                        stroke='#c1282b'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1429.741 58.88)'
                    />
                    <path
                        fill='#fff'
                        stroke='#c1282b'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1462.12 26.62)'
                    />
                    <path
                        fill='#fff'
                        stroke='#f5d618'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(603.246 106.261)'
                    />
                    <path
                        fill='#fff'
                        stroke='#f5d618'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(672.484 172.04)'
                    />
                    <path
                        fill='#fff'
                        stroke='#f5d618'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(708.585 211.871)'
                    />
                    <path
                        fill='#fff'
                        stroke='#f5d618'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(748.427 252.17)'
                    />
                    <path
                        fill='#fff'
                        stroke='#f5d618'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(820.703 324.446)'
                    />
                    <path
                        fill='#fff'
                        stroke='#f5d618'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(839.925 344.069)'
                    />
                    <path
                        fill='#fff'
                        stroke='#f5d618'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(857.975 361.685)'
                    />
                    <path
                        fill='#fff'
                        stroke='#f5d618'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(876.394 380.527)'
                    />
                    <path
                        fill='#fff'
                        stroke='#f5d618'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(888.64 405.584)'
                    />
                    <path
                        fill='#fff'
                        stroke='#f5d618'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(886.482 475.246)'
                    />
                    <path
                        fill='#fff'
                        stroke='#f5d618'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(886.482 494.989)'
                    />
                    <path
                        fill='#fff'
                        stroke='#f5d618'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(886.482 611.76)'
                    />
                    <path
                        fill='#fff'
                        stroke='#f5d618'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(886.482 720.723)'
                    />
                    <path
                        fill='#fff'
                        stroke='#f5d618'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(886.482 745.726)'
                    />
                    <path
                        fill='#fff'
                        stroke='#f5d618'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(886.482 763.863)'
                    />
                    <path
                        fill='#fff'
                        stroke='#f5d618'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(886.482 862.683)'
                    />
                    <path
                        fill='#fff'
                        stroke='#f5d618'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(837.43 907.938)'
                    />
                    <path
                        fill='#fff'
                        stroke='#f5d618'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(774.46 989.283)'
                    />
                    <path
                        fill='#fff'
                        stroke='#f5d618'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(774.46 1016.531)'
                    />
                    <path
                        fill='#fff'
                        stroke='#f5d618'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(774.46 1043.79)'
                    />
                    <path
                        fill='#fff'
                        stroke='#f5d618'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(774.46 1072.678)'
                    />
                    <path
                        fill='#fff'
                        stroke='#f5d618'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(774.46 1104.45)'
                    />
                    <path
                        fill='#fff'
                        stroke='#f5d618'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(774.46 1123.324)'
                    />
                    <path
                        fill='#fff'
                        stroke='#f5d618'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(774.46 1142.21)'
                    />
                    <path
                        fill='#fff'
                        stroke='#f5d618'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(774.46 1161.073)'
                    />
                    <path
                        fill='#fff'
                        stroke='#f5d618'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(774.46 1231.679)'
                    />
                    <path
                        fill='#fff'
                        stroke='#f5d618'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(774.46 1297.468)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(413.72 1248.698)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(413.72 1190.806)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(413.72 1132.913)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(413.72 1076.387)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(413.72 1017.117)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(413.72 959.225)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(413.72 901.332)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(413.72 785.536)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(413.72 727.644)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(413.72 669.75)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(413.72 611.848)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(460.982 562.21)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(495.51 553.738)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(528.626 553.738)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(564 553.738)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(657.244 553.738)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(672.192 553.738)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(724.758 553.738)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(741.083 553.738)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(767.725 553.738)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(785.102 553.738)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(817.276 553.738)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(843.255 553.738)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(930.566 553.738)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(989.088 568.057)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1010.674 581.431)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1080.217 638.825)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1128.357 684.08)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1150.573 705.884)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1173.689 727.839)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1196.522 749.284)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1218.195 769.525)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1279.114 827.266)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1310.594 857.042)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1342.062 886.818)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1373.541 916.594)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1405.02 946.37)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1436.488 976.147)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1467.968 1005.923)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1071.463 571.159)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1095.088 548.369)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1118.052 525.925)'
                    />
                    <path
                        fill='#fff'
                        stroke='#3e77bc'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1237.037 411.236)'
                    />
                    <path
                        fill='#fff'
                        stroke='#52aa55'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(33.692 494.435)'
                    />
                    <path
                        fill='#fff'
                        stroke='#52aa55'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(66.3 494.435)'
                    />
                    <path
                        fill='#fff'
                        stroke='#52aa55'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(98.907 494.435)'
                    />
                    <path
                        fill='#fff'
                        stroke='#52aa55'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(131.503 494.435)'
                    />
                    <path
                        fill='#fff'
                        stroke='#52aa55'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(164.11 494.435)'
                    />
                    <path
                        fill='#fff'
                        stroke='#52aa55'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(196.718 494.435)'
                    />
                    <path
                        fill='#fff'
                        stroke='#52aa55'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(229.325 494.435)'
                    />
                    <path
                        fill='#fff'
                        stroke='#52aa55'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(261.921 494.435)'
                    />
                    <path
                        fill='#fff'
                        stroke='#52aa55'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(294.529 494.435)'
                    />
                    <path
                        fill='#fff'
                        stroke='#52aa55'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(327.136 494.435)'
                    />
                    <path
                        fill='#fff'
                        stroke='#52aa55'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(359.743 494.435)'
                    />
                    <path
                        fill='#fff'
                        stroke='#52aa55'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(392.35 494.435)'
                    />
                    <path
                        fill='#fff'
                        stroke='#52aa55'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(442.921 494.435)'
                    />
                    <path
                        fill='#fff'
                        stroke='#52aa55'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(472.751 494.435)'
                    />
                    <path
                        fill='#fff'
                        stroke='#52aa55'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(510.424 494.435)'
                    />
                    <path
                        fill='#fff'
                        stroke='#52aa55'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(544.594 494.435)'
                    />
                    <path
                        fill='#fff'
                        stroke='#52aa55'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(574.305 494.435)'
                    />
                    <path
                        fill='#fff'
                        stroke='#52aa55'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(658.112 494.435)'
                    />
                    <path
                        fill='#fff'
                        stroke='#52aa55'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(688.04 494.435)'
                    />
                    <path
                        fill='#fff'
                        stroke='#52aa55'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(695.34 519.58)'
                    />
                    <path
                        fill='#fff'
                        stroke='#8115ff'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(961.99 458.042)'
                    />
                    <path
                        fill='#fff'
                        stroke='#8115ff'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(961.99 479.607)'
                    />
                    <path
                        fill='#fff'
                        stroke='#8115ff'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(961.99 492.96)'
                    />
                    <path
                        fill='#fff'
                        stroke='#8115ff'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(961.99 530.991)'
                    />
                    <path
                        fill='#fff'
                        stroke='#8115ff'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(961.99 636.59)'
                    />
                    <path
                        fill='#fff'
                        stroke='#8115ff'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(905.866 730.605)'
                    />
                    <path
                        fill='#fff'
                        stroke='#8115ff'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(956.621 738.936)'
                    />
                    <path
                        fill='#fff'
                        stroke='#8115ff'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(965.408 763.245)'
                    />
                    <path
                        fill='#fff'
                        stroke='#8115ff'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(964.941 829.74)'
                    />
                    <path
                        fill='#fff'
                        stroke='#8115ff'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(965.256 870.677)'
                    />
                    <path
                        fill='#fff'
                        stroke='#8115ff'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(965.581 913.655)'
                    />
                    <path
                        fill='#fff'
                        stroke='#8115ff'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(965.408 992.635)'
                    />
                    <path
                        fill='#fff'
                        stroke='#8115ff'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(965.408 1014.384)'
                    />
                    <path
                        fill='#fff'
                        stroke='#8115ff'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(965.408 1036.144)'
                    />
                    <path
                        fill='#fff'
                        stroke='#8115ff'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(965.408 1057.893)'
                    />
                    <path
                        fill='#fff'
                        stroke='#8115ff'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(965.408 1079.642)'
                    />
                    <path
                        fill='#fff'
                        stroke='#8115ff'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(965.408 1093.288)'
                    />
                    <path
                        fill='#fff'
                        stroke='#8115ff'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(965.408 1123.15)'
                    />
                    <path
                        fill='#fff'
                        stroke='#8115ff'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(965.408 1144.91)'
                    />
                    <path
                        fill='#fff'
                        stroke='#8115ff'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(965.408 1166.66)'
                    />
                    <path
                        fill='#fff'
                        stroke='#8115ff'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(965.408 1188.408)'
                    />
                    <path
                        fill='#fff'
                        stroke='#8115ff'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(965.408 1210.168)'
                    />
                    <path
                        fill='#fff'
                        stroke='#8115ff'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(965.408 1231.917)'
                    />
                    <path
                        fill='#fff'
                        stroke='#8115ff'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(965.408 1253.666)'
                    />
                    <path
                        fill='#fff'
                        stroke='#8115ff'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(965.408 1275.426)'
                    />
                    <path
                        fill='#fff'
                        stroke='#8115ff'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(965.408 1297.175)'
                    />
                    <path
                        fill='#fff'
                        stroke='#8115ff'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(965.408 1318.935)'
                    />
                    <path
                        fill='#fff'
                        stroke='#8115ff'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(965.408 1340.684)'
                    />
                    <path
                        fill='#fff'
                        stroke='#e692be'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(739.695 333.85)'
                    />
                    <path
                        fill='#fff'
                        stroke='#e692be'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(656.268 431.737)'
                    />
                    <path
                        fill='#fff'
                        stroke='#e692be'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(626.893 534.289)'
                    />
                    <path
                        fill='#fff'
                        stroke='#e692be'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(638.077 609.732)'
                    />
                    <path
                        fill='#fff'
                        stroke='#e692be'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(661.8 669.523)'
                    />
                    <path
                        fill='#fff'
                        stroke='#e692be'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(701.11 723.76)'
                    />
                    <path
                        fill='#fff'
                        stroke='#e692be'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(761.422 770.534)'
                    />
                    <path
                        fill='#fff'
                        stroke='#e692be'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(789.257 783.93)'
                    />
                    <path
                        fill='#fff'
                        stroke='#e692be'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(817.286 794.29)'
                    />
                    <path
                        fill='#fff'
                        stroke='#e692be'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(856.163 801.71)'
                    />
                    <path
                        fill='#fff'
                        stroke='#e692be'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(921.682 801.829)'
                    />
                    <path
                        fill='#fff'
                        stroke='#e692be'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1010.533 774.114)'
                    />
                    <path
                        fill='#fff'
                        stroke='#e692be'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1049.052 749.284)'
                    />
                    <path
                        fill='#fff'
                        stroke='#e692be'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1075.671 721.417)'
                    />
                    <path
                        fill='#fff'
                        stroke='#e692be'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1125.494 650.649)'
                    />
                    <path
                        fill='#fff'
                        stroke='#e692be'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1134.725 626.177)'
                    />
                    <path
                        fill='#fff'
                        stroke='#e692be'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1141.873 598.809)'
                    />
                    <path
                        fill='#fff'
                        stroke='#e692be'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1146.483 563.305)'
                    />
                    <path
                        fill='#fff'
                        stroke='#e692be'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1146.483 530.991)'
                    />
                    <path
                        fill='#fff'
                        stroke='#e692be'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1137.274 474.411)'
                    />
                    <path
                        fill='#fff'
                        stroke='#e692be'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1125.927 441.153)'
                    />
                    <path
                        fill='#fff'
                        stroke='#e692be'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1110.882 411.485)'
                    />
                    <path
                        fill='#fff'
                        stroke='#e692be'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1095.522 302.794)'
                    />
                    <path
                        fill='#fff'
                        stroke='#e692be'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1095.522 246.876)'
                    />
                    <path
                        fill='#fff'
                        stroke='#e692be'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1095.522 190.947)'
                    />
                    <path
                        fill='#fff'
                        stroke='#e692be'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1095.522 135.028)'
                    />
                    <path
                        fill='#fff'
                        stroke='#F0F'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(441.012 618.757)'
                    />
                    <path
                        fill='#fff'
                        stroke='#F0F'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(458.802 689.081)'
                    />
                    <path
                        fill='#fff'
                        stroke='#F0F'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(490.476 759.296)'
                    />
                    <path
                        fill='#fff'
                        stroke='#F0F'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(537.695 824.5)'
                    />
                    <path
                        fill='#fff'
                        stroke='#F0F'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(595.956 878.694)'
                    />
                    <path
                        fill='#fff'
                        stroke='#F0F'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(664.837 926.26)'
                    />
                    <path
                        fill='#fff'
                        stroke='#F0F'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(686.673 935.903)'
                    />
                    <path
                        fill='#fff'
                        stroke='#F0F'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(709.485 945.025)'
                    />
                    <path
                        fill='#fff'
                        stroke='#F0F'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(732.492 953.551)'
                    />
                    <path
                        fill='#fff'
                        stroke='#F0F'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(755.695 960.266)'
                    />
                    <path
                        fill='#fff'
                        stroke='#F0F'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(813.392 970.397)'
                    />
                    <path
                        fill='#fff'
                        stroke='#F0F'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(856.63 974.39)'
                    />
                    <path
                        fill='#fff'
                        stroke='#F0F'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(911.138 973.652)'
                    />
                    <path
                        fill='#fff'
                        stroke='#F0F'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(939.005 970.777)'
                    />
                    <path
                        fill='#fff'
                        stroke='#F0F'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(995.054 959.442)'
                    />
                    <path
                        fill='#fff'
                        stroke='#F0F'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1037.912 945.047)'
                    />
                    <path
                        fill='#fff'
                        stroke='#F0F'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1082.82 925.76)'
                    />
                    <path
                        fill='#fff'
                        stroke='#F0F'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1126.21 900.03)'
                    />
                    <path
                        fill='#fff'
                        stroke='#F0F'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1163.883 871.87)'
                    />
                    <path
                        fill='#fff'
                        stroke='#F0F'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1195.698 841.997)'
                    />
                    <path
                        fill='#fff'
                        stroke='#F0F'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(1224.91 809.411)'
                    />
                    <path
                        fill='#fff'
                        stroke='#d4d4d6'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(381.178 835.5)'
                    />
                    <path
                        fill='#fff'
                        stroke='#d4d4d6'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(359.483 835.5)'
                    />
                    <path
                        fill='#fff'
                        stroke='#eb8923'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(813.555 647.297)'
                    />
                    <path
                        fill='#fff'
                        stroke='#eb8923'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(641.7 944.103)'
                    />
                    <path
                        fill='#fff'
                        stroke='#eb8923'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(555.539 1094.145)'
                    />
                    <path
                        fill='#fff'
                        stroke='#015b97'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(626.144 1186.857)'
                    />
                    <path
                        fill='#fff'
                        stroke='#015b97'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(636.048 1122.673)'
                    />
                    <path
                        fill='#fff'
                        stroke='#015b97'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(646.223 1085.456)'
                    />
                    <path
                        fill='#fff'
                        stroke='#015b97'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(704.191 1102.551)'
                    />
                    <path
                        fill='#fff'
                        stroke='#015b97'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(814.227 1186.857)'
                    />
                    <path
                        fill='#fff'
                        stroke='#015b97'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(884.345 1186.857)'
                    />
                    <path
                        fill='#fff'
                        stroke='#015b97'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(884.345 1263.158)'
                    />
                    <path
                        fill='#fff'
                        stroke='#015b97'
                        strokeWidth={1.333}
                        d='M0-4a4 4 0 1 1 0 8 4 4 0 1 1 0-8Z'
                        className='station'
                        style={{
                            cursor: 'pointer',
                        }}
                        transform='translate(884.345 1312.796)'
                    />
                </g>
                <g className='labels'>
                    <g className='label'>
                        <text
                            x={470.014}
                            y={190.571}
                            className='RHW-RI'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={470.014} y={190.571} dominantBaseline='hanging' dy='0em'>
                                Rithala
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={486.372}
                            y={206.896}
                            className='RHW-RI RHE-RHW'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={486.372} y={206.896} dominantBaseline='hanging' dy='0em'>
                                Rohini West
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={505.821}
                            y={225.944}
                            className='RHE-RHW PTP-RHE'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={505.821} y={225.944} dominantBaseline='hanging' dy='0em'>
                                Rohini East
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={527.603}
                            y={241.163}
                            className='PTP-RHE KE-PTP'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={527.603} y={241.163} dominantBaseline='hanging' dy='0em'>
                                Pitampura
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={598.013}
                            y={317.54}
                            className='KE-PTP NSHP-KE'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={598.013} y={317.54} dominantBaseline='hanging' dy='0em'>
                                Kohat Enclave
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={670.686}
                            y={384.356}
                            className='NSHP-KE KP-NSHP NSHP-SMBG SAKP-NSHP'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={670.686} y={384.356} dominantBaseline='middle' dy='0em'>
                                {'Netaji Subhash Place\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={696.635}
                            y={396.035}
                            className='KP-NSHP KN-KP'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={696.635} y={396.035} dominantBaseline='middle' dy='0em'>
                                Keshav Puram
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={707.124}
                            y={406.622}
                            className='KN-KP ILOK-KN'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={707.124} y={406.622} dominantBaseline='middle' dy='0em'>
                                {'Kanhaiya Nagar\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={733.451}
                            y={425.605}
                            className='ILOK-KN SHT-ILOK ILOK-APMN'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={733.451} y={425.605} dominantBaseline='middle' dy='0em'>
                                Inderlok
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={757.441}
                            y={450.869}
                            className='SHT-ILOK PRA-SHT'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={757.441} y={450.869} dominantBaseline='hanging' dy='0em'>
                                Shastri Nagar
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={793.802}
                            y={436.469}
                            className='PRA-SHT PBGH-PRA'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={793.802} y={436.469} dominantBaseline='middle' dy='0em'>
                                Pratap Nagar
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={828.036}
                            y={450.869}
                            className='PBGH-PRA TZI-PBGH'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={828.036} y={450.869} dominantBaseline='hanging' dy='0em'>
                                Pulbangash
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={866.544}
                            y={450.869}
                            className='TZI-PBGH KG-TZI'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={866.544} y={450.869} dominantBaseline='hanging' dy='0em'>
                                Tis Hazari
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={891.573}
                            y={438.578}
                            className='KG-TZI SHPK-KG KG-CL CHK-KG LLQA-KG'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={891.573} y={438.578} dominantBaseline='middle' dy='0em'>
                                Kashmere Gate
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1023.044}
                            y={448.761}
                            className='SHPK-KG SLAP-SHPK'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1023.044} y={448.761} dominantBaseline='hanging' dy='0em'>
                                Shastri Park
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1067.106}
                            y={420.178}
                            className='SLAP-SHPK WC-SLAP'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1067.106} y={420.178} dominantBaseline='hanging' dy='0em'>
                                Seelampur
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1085.882}
                            y={383.792}
                            className='WC-SLAP SHD-WC WC-EANR JFRB-WC'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={1085.882} y={383.792} dominantBaseline='middle' dy='0em'>
                                Welcome
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1143.461}
                            y={354.367}
                            className='SHD-WC MPK-SHD'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1143.461} y={354.367} dominantBaseline='hanging' dy='0em'>
                                Shahdara
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1175.829}
                            y={322.096}
                            className='MPK-SHD JLML-MPK'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1175.829} y={322.096} dominantBaseline='hanging' dy='0em'>
                                {'Mansarovar Park\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1208.209}
                            y={289.835}
                            className='JLML-MPK DSG-JLML'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1208.209} y={289.835} dominantBaseline='hanging' dy='0em'>
                                Jhilmil
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1240.577}
                            y={257.564}
                            className='DSG-JLML SHDN-DSG'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1240.577} y={257.564} dominantBaseline='hanging' dy='0em'>
                                {'Dilshad Garden\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1272.957}
                            y={225.304}
                            className='SHDN-DSG RJBH-SHDN'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1272.957} y={225.304} dominantBaseline='hanging' dy='0em'>
                                Shaheed Nagar
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1305.336}
                            y={193.033}
                            className='RJBH-SHDN RJNM-RJBH'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1305.336} y={193.033} dominantBaseline='hanging' dy='0em'>
                                Raj Bagh
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1337.705}
                            y={160.773}
                            className='RJNM-RJBH SMPK-RJNM'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1337.705} y={160.773} dominantBaseline='hanging' dy='0em'>
                                {'Major Mohit Sharma\n          '}
                            </tspan>
                            <tspan
                                x={1337.705}
                                y={160.773}
                                dominantBaseline='hanging'
                                dy='1.1em'
                            >
                                {'Rajendra Nagar\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1370.084}
                            y={128.502}
                            className='SMPK-RJNM MNGM-SMPK'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1370.084} y={128.502} dominantBaseline='hanging' dy='0em'>
                                Shyam Park
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1402.464}
                            y={96.242}
                            className='MNGM-SMPK ATHA-MNGM'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1402.464} y={96.242} dominantBaseline='hanging' dy='0em'>
                                Mohan Nagar
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1434.833}
                            y={63.971}
                            className='ATHA-MNGM HDNR-ATHA'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1434.833} y={63.971} dominantBaseline='hanging' dy='0em'>
                                Arthala
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1467.212}
                            y={31.711}
                            className='HDNR-ATHA NBAA-HDNR'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1467.212} y={31.711} dominantBaseline='hanging' dy='0em'>
                                Hindon River
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1493.181}
                            y={6.176}
                            className='NBAA-HDNR'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1493.181} y={6.176} dominantBaseline='hanging' dy='0em'>
                                {'Shaheed Sthal (New\n          '}
                            </tspan>
                            <tspan x={1493.181} y={6.176} dominantBaseline='hanging' dy='1.1em'>
                                Bus Adda)
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={557.771}
                            y={53.456}
                            className='RISE-SPBI'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={557.771} y={53.456} dominantBaseline='middle' dy='0em'>
                                Samaypur Badli
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={610.446}
                            y={106.261}
                            className='RISE-SPBI BIMR-RISE'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={610.446} y={101.261} dominantBaseline='middle' dy='0em'>
                                {'Rohini Sector -\n          '}
                            </tspan>
                            <tspan x={610.446} y={101.261} dominantBaseline='middle' dy='1.1em'>
                                18,19
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={679.684}
                            y={172.04}
                            className='BIMR-RISE JGPI-BIMR'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={679.684} y={172.04} dominantBaseline='middle' dy='0em'>
                                {'Haiderpur Badli Mor\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={715.785}
                            y={211.871}
                            className='JGPI-BIMR AHNR-JGPI'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={715.785} y={211.871} dominantBaseline='middle' dy='0em'>
                                JahangirPuri
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={755.627}
                            y={252.169}
                            className='AHNR-JGPI AZU-AHNR'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={755.627} y={252.169} dominantBaseline='middle' dy='0em'>
                                Adarsh Nagar
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={787.752}
                            y={294.051}
                            className='AZU-AHNR MDTW-AZU AZU-MKPR SMBG-AZU'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={787.752} y={294.051} dominantBaseline='middle' dy='0em'>
                                Azadpur
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={827.903}
                            y={324.446}
                            className='MDTW-AZU GTBR-MDTW'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={827.903} y={324.446} dominantBaseline='middle' dy='0em'>
                                Model Town
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={847.125}
                            y={344.069}
                            className='GTBR-MDTW VW-GTBR'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={847.125} y={339.069} dominantBaseline='middle' dy='0em'>
                                {'Guru Teg Bahadur\n          '}
                            </tspan>
                            <tspan x={847.125} y={339.069} dominantBaseline='middle' dy='1.1em'>
                                Nagar
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={865.175}
                            y={361.685}
                            className='VW-GTBR VS-VW'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={865.175} y={361.685} dominantBaseline='middle' dy='0em'>
                                Vishwavidyalaya
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={883.594}
                            y={380.527}
                            className='VS-VW CL-VS'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={883.594} y={380.527} dominantBaseline='middle' dy='0em'>
                                Vidhan Sabha
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={895.841}
                            y={405.584}
                            className='CL-VS KG-CL'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={895.841} y={405.584} dominantBaseline='middle' dy='0em'>
                                Civil Lines
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={893.682}
                            y={475.246}
                            className='CHK-KG CWBR-CHK'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={893.682} y={475.246} dominantBaseline='middle' dy='0em'>
                                Chandni Chowk
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={893.682}
                            y={494.989}
                            className='CWBR-CHK NDI-CWBR'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={893.682} y={494.989} dominantBaseline='middle' dy='0em'>
                                Chawri Bazar
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={894.062}
                            y={506.194}
                            className='NDI-CWBR RCK-NDI SJSU-NDI'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={894.062} y={506.194} dominantBaseline='middle' dy='0em'>
                                New Delhi
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={891.953}
                            y={558.829}
                            className='RCK-NDI PTCK-RCK RCK-RKAM BRKR-RCK'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={891.953} y={558.829} dominantBaseline='hanging' dy='0em'>
                                Rajiv Chowk
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={893.682}
                            y={611.761}
                            className='PTCK-RCK CTST-PTCK'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={893.682} y={611.761} dominantBaseline='middle' dy='0em'>
                                Patel Chowk
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={877.026}
                            y={683.386}
                            className='CTST-PTCK UDB-CTST CTST-JNPH KM-CTST'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={877.026} y={683.386} dominantBaseline='middle' dy='0em'>
                                {'Central Secretariat\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={879.282}
                            y={720.723}
                            className='UDB-CTST LKM-UDB'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={879.282} y={720.723} dominantBaseline='middle' dy='0em'>
                                Udyog Bhawan
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={879.282}
                            y={745.726}
                            className='LKM-UDB JB-LKM'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={879.282} y={745.726} dominantBaseline='middle' dy='0em'>
                                Lok Kalyan Marg
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={893.682}
                            y={763.863}
                            className='JB-LKM INA-JB'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={893.682} y={763.863} dominantBaseline='middle' dy='0em'>
                                Jor Bagh
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={891.573}
                            y={795.328}
                            className='INA-JB AIIMS-INA INA-SOJI SOEN-INA'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={891.573} y={795.328} dominantBaseline='middle' dy='0em'>
                                Dilli Haat-INA
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={891.573}
                            y={867.774}
                            className='AIIMS-INA GNPK-AIIMS'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={891.573} y={867.774} dominantBaseline='hanging' dy='0em'>
                                AIIMS
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={842.521}
                            y={913.029}
                            className='GNPK-AIIMS HKS-GNPK'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={842.521} y={913.029} dominantBaseline='hanging' dy='0em'>
                                Green Park
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={769.37}
                            y={966.518}
                            className='HKS-GNPK MVNR-HKS HKS-IIT PSPK-HKS'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={769.37} y={966.518} dominantBaseline='hanging' dy='0em'>
                                Hauz Khas
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={781.661}
                            y={989.283}
                            className='MVNR-HKS SAKT-MVNR'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={781.661} y={989.283} dominantBaseline='middle' dy='0em'>
                                Malviya Nagar
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={781.661}
                            y={1016.531}
                            className='SAKT-MVNR QM-SAKT'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={781.661} y={1016.531} dominantBaseline='middle' dy='0em'>
                                Saket
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={781.661}
                            y={1043.791}
                            className='QM-SAKT CHTP-QM'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={781.661} y={1043.791} dominantBaseline='middle' dy='0em'>
                                Qutab Minar
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={781.661}
                            y={1072.678}
                            className='CHTP-QM SLTP-CHTP'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={781.661} y={1072.678} dominantBaseline='middle' dy='0em'>
                                Chhatarpur
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={781.661}
                            y={1104.45}
                            className='SLTP-CHTP GTNI-SLTP'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={781.661} y={1104.45} dominantBaseline='middle' dy='0em'>
                                Sultanpur
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={781.661}
                            y={1123.324}
                            className='GTNI-SLTP AJG-GTNI'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={781.661} y={1123.324} dominantBaseline='middle' dy='0em'>
                                Ghitorni
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={781.661}
                            y={1142.209}
                            className='AJG-GTNI GE-AJG'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={781.661} y={1142.209} dominantBaseline='middle' dy='0em'>
                                Arjan Garh
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={781.661}
                            y={1161.073}
                            className='GE-AJG SKRP-GE'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={781.661} y={1161.073} dominantBaseline='middle' dy='0em'>
                                {'Guru Dronacharya\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={779.552}
                            y={1181.766}
                            className='SKRP-GE MGRO-SKRP SKRP-DL2 PH1-SKRP'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan
                                x={779.552}
                                y={1181.766}
                                dominantBaseline='middle'
                                dy='0em'
                            >
                                Sikanderpur
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={781.661}
                            y={1231.679}
                            className='MGRO-SKRP IFOC-MGRO'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={781.661} y={1231.679} dominantBaseline='middle' dy='0em'>
                                M.G. Road
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={781.661}
                            y={1297.468}
                            className='IFOC-MGRO HCC-IFOC'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={781.661} y={1297.468} dominantBaseline='middle' dy='0em'>
                                IFFCO Chowk
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={781.661}
                            y={1363.247}
                            className='HCC-IFOC'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={781.661} y={1358.247} dominantBaseline='middle' dy='0em'>
                                {'Millennium City\n          '}
                            </tspan>
                            <tspan
                                x={781.661}
                                y={1358.247}
                                dominantBaseline='middle'
                                dy='1.1em'
                            >
                                {'Centre Gurugram\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={406.52}
                            y={1311.646}
                            className='DSET-DSTO DSTO-APOT IICC-DSTO'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={406.52} y={1311.646} dominantBaseline='middle' dy='0em'>
                                {'Dwarka Sector - 21\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={406.52}
                            y={1248.698}
                            className='DSET-DSTO DSN-DSET'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={406.52} y={1248.698} dominantBaseline='middle' dy='0em'>
                                {'Dwarka Sector - 8\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={406.52}
                            y={1190.806}
                            className='DSN-DSET DST-DSN'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={406.52} y={1190.806} dominantBaseline='middle' dy='0em'>
                                {'Dwarka Sector - 9\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={406.52}
                            y={1132.913}
                            className='DST-DSN DSE-DST'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={406.52} y={1132.913} dominantBaseline='middle' dy='0em'>
                                {'Dwarka Sector - 10\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={406.52}
                            y={1076.387}
                            className='DSE-DST DSW-DSE'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={406.52} y={1076.387} dominantBaseline='middle' dy='0em'>
                                {'Dwarka Sector - 11\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={406.52}
                            y={1017.117}
                            className='DSW-DSE DSTN-DSW'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={406.52} y={1017.117} dominantBaseline='middle' dy='0em'>
                                {'Dwarka Sector - 12\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={406.52}
                            y={959.225}
                            className='DSTN-DSW DSFN-DSTN'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={406.52} y={959.225} dominantBaseline='middle' dy='0em'>
                                {'Dwarka Sector - 13\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={406.52}
                            y={901.332}
                            className='DSFN-DSTN DW-DSFN'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={406.52} y={901.332} dominantBaseline='middle' dy='0em'>
                                {'Dwarka Sector - 14\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={420.92}
                            y={835.499}
                            className='DW-DSFN DM-DW NNGI-DW'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={420.92} y={835.499} dominantBaseline='middle' dy='0em'>
                                Dwarka
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={406.52}
                            y={785.536}
                            className='DM-DW NWD-DM'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={406.52} y={785.536} dominantBaseline='middle' dy='0em'>
                                Dwarka Mor
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={406.52}
                            y={727.644}
                            className='NWD-DM UNW-NWD'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={406.52} y={727.644} dominantBaseline='middle' dy='0em'>
                                Nawada
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={406.52}
                            y={669.751}
                            className='UNW-NWD UNE-UNW'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={406.52} y={669.751} dominantBaseline='middle' dy='0em'>
                                {'Uttam Nagar West\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={406.52}
                            y={611.848}
                            className='UNE-UNW JPW-UNE'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={406.52} y={611.848} dominantBaseline='middle' dy='0em'>
                                {'Uttam Nagar East\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={439.031}
                            y={576.586}
                            className='JPW-UNE JPE-JPW DBMR-JPW'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={439.031} y={576.586} dominantBaseline='hanging' dy='0em'>
                                {'Janakpuri West\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={466.073}
                            y={567.301}
                            className='JPE-JPW TN-JPE'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={466.073} y={567.301} dominantBaseline='hanging' dy='0em'>
                                Janakpuri East
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={495.509}
                            y={560.938}
                            className='TN-JPE SN-TN'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={495.509} y={560.938} dominantBaseline='hanging' dy='0em'>
                                Tilak Nagar
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={528.626}
                            y={546.538}
                            className='SN-TN TG-SN'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={528.626} y={546.538} dominantBaseline='middle' dy='0em'>
                                Subhash Nagar
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={569.091}
                            y={548.647}
                            className='TG-SN RG-TG'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={569.091} y={548.647} dominantBaseline='middle' dy='0em'>
                                Tagore Garden
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={622.333}
                            y={558.829}
                            className='RG-TG RN-RG RG-ESIH MYPI-RG'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={622.333} y={558.829} dominantBaseline='hanging' dy='0em'>
                                Rajouri Garden
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={657.244}
                            y={560.938}
                            className='RN-RG MN-RN'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={657.244} y={560.938} dominantBaseline='hanging' dy='0em'>
                                Ramesh Nagar
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={672.192}
                            y={546.538}
                            className='MN-RN KNR-MN'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={672.192} y={546.538} dominantBaseline='middle' dy='0em'>
                                Moti Nagar
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={699.972}
                            y={560.938}
                            className='KNR-MN SP-KNR KNR-SRSM'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={699.972} y={560.938} dominantBaseline='hanging' dy='0em'>
                                Kirti Nagar
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={724.758}
                            y={546.538}
                            className='SP-KNR PN-SP'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={724.758} y={546.538} dominantBaseline='middle' dy='0em'>
                                Shadipur
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={741.083}
                            y={560.938}
                            className='PN-SP RP-PN'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={741.083} y={560.938} dominantBaseline='hanging' dy='0em'>
                                Patel Nagar
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={767.725}
                            y={546.538}
                            className='RP-PN KB-RP'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={767.725} y={546.538} dominantBaseline='middle' dy='0em'>
                                Rajendra Place
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={785.102}
                            y={560.938}
                            className='KB-RP JW-KB'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={785.102} y={560.938} dominantBaseline='hanging' dy='0em'>
                                Karol Bagh
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={817.276}
                            y={546.538}
                            className='JW-KB RKAM-JW'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={817.276} y={546.538} dominantBaseline='middle' dy='0em'>
                                Jhandewalan
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={843.255}
                            y={560.938}
                            className='RKAM-JW RCK-RKAM'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={843.255} y={560.938} dominantBaseline='hanging' dy='0em'>
                                {'Ramakrishna Ashram\n          '}
                            </tspan>
                            <tspan
                                x={843.255}
                                y={560.938}
                                dominantBaseline='hanging'
                                dy='1.1em'
                            >
                                Marg
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={930.566}
                            y={546.538}
                            className='BRKR-RCK MDHS-BRKR'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={930.566} y={546.538} dominantBaseline='middle' dy='0em'>
                                {'Barakhamba Road\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={967.082}
                            y={548.647}
                            className='MDHS-BRKR PTMD-MDHS MDHS-ITO JNPH-MDHS'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={967.082} y={548.647} dominantBaseline='middle' dy='0em'>
                                Mandi House
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={994.179}
                            y={562.965}
                            className='PTMD-MDHS IDPT-PTMD'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={994.179} y={562.965} dominantBaseline='middle' dy='0em'>
                                Supreme Court
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1003.474}
                            y={581.431}
                            className='IDPT-PTMD YB-IDPT'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={1003.474} y={581.431} dominantBaseline='middle' dy='0em'>
                                Indraprastha
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1027.24}
                            y={598.126}
                            className='YB-IDPT ASDM-YB LN-YB'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={1027.24} y={598.126} dominantBaseline='middle' dy='0em'>
                                Yamuna Bank
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1073.017}
                            y={638.825}
                            className='ASDM-YB MVP1-ASDM'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={1073.017} y={638.825} dominantBaseline='middle' dy='0em'>
                                Akshardham
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1124.243}
                            y={667.853}
                            className='MVP1-ASDM MVE-MVP1 MVP1-NIZM MVPO-MVP1'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1124.243} y={667.853} dominantBaseline='middle' dy='0em'>
                                Mayur Vihar-1
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1135.557}
                            y={684.08}
                            className='MVE-MVP1 NAGR-MVE'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1135.557} y={679.08} dominantBaseline='middle' dy='0em'>
                                Mayur Vihar
                            </tspan>
                            <tspan x={1135.557} y={679.08} dominantBaseline='middle' dy='1.1em'>
                                Extension
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1157.773}
                            y={705.884}
                            className='NAGR-MVE NSFT-NAGR'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1157.773} y={705.884} dominantBaseline='middle' dy='0em'>
                                {'New Ashok Nagar\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1180.889}
                            y={727.839}
                            className='NSFT-NAGR NSST-NSFT'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1180.889} y={727.839} dominantBaseline='middle' dy='0em'>
                                Noida Sec-15
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1203.722}
                            y={749.284}
                            className='NSST-NSFT NSET-NSST'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1203.722} y={749.284} dominantBaseline='middle' dy='0em'>
                                Noida Sec-16
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1225.395}
                            y={769.525}
                            className='NSET-NSST BCGN-NSET'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1225.395} y={769.525} dominantBaseline='middle' dy='0em'>
                                Noida Sec-18
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1243.5}
                            y={781.783}
                            className='BCGN-NSET GEC-BCGN BCGN-OKBS'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1243.5} y={781.783} dominantBaseline='middle' dy='0em'>
                                {'Botanical Garden\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1286.314}
                            y={827.266}
                            className='GEC-BCGN NCC-GEC'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1286.314} y={827.266} dominantBaseline='middle' dy='0em'>
                                Golf Course
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1317.794}
                            y={857.042}
                            className='NCC-GEC STFN-NCC'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1317.794} y={857.042} dominantBaseline='middle' dy='0em'>
                                {'Noida City Centre\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1349.262}
                            y={886.818}
                            className='STFN-NCC SFTN-STFN'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1349.262} y={886.818} dominantBaseline='middle' dy='0em'>
                                {'Sector-34 Noida\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1380.741}
                            y={916.594}
                            className='SFTN-STFN SSON-SFTN'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1380.741} y={916.594} dominantBaseline='middle' dy='0em'>
                                Sec-52 Noida
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1412.22}
                            y={946.37}
                            className='SSON-SFTN SFNN-SSON'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1412.22} y={946.37} dominantBaseline='middle' dy='0em'>
                                Sec-61 Noida
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1443.688}
                            y={976.147}
                            className='SFNN-SSON SSTN-SFNN'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1443.688} y={976.147} dominantBaseline='middle' dy='0em'>
                                Sec-59 Noida
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1475.168}
                            y={1005.923}
                            className='SSTN-SFNN NECC-SSTN'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1475.168} y={1005.923} dominantBaseline='middle' dy='0em'>
                                Sec-62 Noida
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1506.115}
                            y={1034.983}
                            className='NECC-SSTN'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1506.115} y={1029.983} dominantBaseline='middle' dy='0em'>
                                {'Noida Electronic\n          '}
                            </tspan>
                            <tspan
                                x={1506.115}
                                y={1029.983}
                                dominantBaseline='middle'
                                dy='1.1em'
                            >
                                City
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1076.554}
                            y={576.25}
                            className='LN-YB NV-LN'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1076.554} y={576.25} dominantBaseline='hanging' dy='0em'>
                                Laxmi Nagar
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1100.179}
                            y={553.46}
                            className='NV-LN PTVR-NV'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1100.179} y={553.46} dominantBaseline='hanging' dy='0em'>
                                Nirman Vihar
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1112.961}
                            y={520.834}
                            className='PTVR-NV KKDA-PTVR'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan
                                x={1112.961}
                                y={520.834}
                                dominantBaseline='middle'
                                dy='0em'
                            >
                                Preet Vihar
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1134.933}
                            y={499.436}
                            className='KKDA-PTVR AVIT-KKDA KKDA-AVIT KKDC-KKDA'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={1134.933} y={499.436} dominantBaseline='middle' dy='0em'>
                                Karkarduma
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1185.657}
                            y={471.388}
                            className='AVIT-KKDA KSHI-AVIT AVIT-IPE KKDA-AVIT'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1185.657} y={471.388} dominantBaseline='hanging' dy='0em'>
                                {'Anand Vihar I.S.B.T\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1242.129}
                            y={416.327}
                            className='KSHI-AVIT VASI-KSHI'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1242.129} y={416.327} dominantBaseline='hanging' dy='0em'>
                                Kaushambi
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1308.092}
                            y={352.674}
                            className='VASI-KSHI'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1308.092} y={352.674} dominantBaseline='hanging' dy='0em'>
                                Vaishali
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={-6.115}
                            y={494.435}
                            className='BUSS-CIPK'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={-6.115} y={494.435} dominantBaseline='middle' dy='0em'>
                                {'Brig. Hoshiar Singh\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={33.692}
                            y={501.635}
                            className='BUSS-CIPK MIEE-BUSS'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={33.692} y={501.635} dominantBaseline='hanging' dy='0em'>
                                {'Bahadurgarh City\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={66.299}
                            y={487.235}
                            className='MIEE-BUSS TKBR-MIEE'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={66.299} y={482.235} dominantBaseline='middle' dy='0em'>
                                {'Pandit Shree Ram\n          '}
                            </tspan>
                            <tspan
                                x={66.299}
                                y={482.235}
                                dominantBaseline='middle'
                                dy='1.1em'
                            >
                                Sharma
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={98.907}
                            y={501.635}
                            className='TKBR-MIEE TKLM-TKBR'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={98.907} y={501.635} dominantBaseline='hanging' dy='0em'>
                                Tikri Border
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={131.503}
                            y={487.235}
                            className='TKLM-TKBR GHEM-TKLM'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={131.503} y={487.235} dominantBaseline='middle' dy='0em'>
                                Tikri Kalan
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={164.11}
                            y={501.635}
                            className='GHEM-TKLM MIAA-GHEM'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={164.11} y={501.635} dominantBaseline='hanging' dy='0em'>
                                {'Ghevra Metro Station\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={196.718}
                            y={487.235}
                            className='MIAA-GHEM MUDK-MIAA'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={196.718} y={482.235} dominantBaseline='middle' dy='0em'>
                                {'Mundka Industrial\n          '}
                            </tspan>
                            <tspan
                                x={196.718}
                                y={482.235}
                                dominantBaseline='middle'
                                dy='1.1em'
                            >
                                Area (MIA)
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={229.325}
                            y={501.635}
                            className='MUDK-MIAA RDPK-MUDK'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={229.325} y={501.635} dominantBaseline='hanging' dy='0em'>
                                Mundka
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={261.921}
                            y={487.235}
                            className='RDPK-MUDK NRSN-RDPK'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={261.921} y={487.235} dominantBaseline='middle' dy='0em'>
                                Rajdhani Park
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={294.529}
                            y={501.635}
                            className='NRSN-RDPK NNOI-NRSN'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={294.529} y={501.635} dominantBaseline='hanging' dy='0em'>
                                {'Nangloi Railway\n          '}
                            </tspan>
                            <tspan
                                x={294.529}
                                y={501.635}
                                dominantBaseline='hanging'
                                dy='1.1em'
                            >
                                Station
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={327.136}
                            y={487.235}
                            className='NNOI-NRSN SMSM-NNOI'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={327.136} y={487.235} dominantBaseline='middle' dy='0em'>
                                Nangloi
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={359.743}
                            y={501.635}
                            className='SMSM-NNOI UNRG-SMSM'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={359.743} y={501.635} dominantBaseline='hanging' dy='0em'>
                                {'Maharaja Surajmal\n          '}
                            </tspan>
                            <tspan
                                x={359.743}
                                y={501.635}
                                dominantBaseline='hanging'
                                dy='1.1em'
                            >
                                Stadium
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={392.35}
                            y={487.235}
                            className='UNRG-SMSM PAGI-UNRG'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={392.35} y={487.235} dominantBaseline='middle' dy='0em'>
                                Udyog Nagar
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={442.921}
                            y={501.635}
                            className='PAGI-UNRG PVW-PAGI'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={442.921} y={501.635} dominantBaseline='hanging' dy='0em'>
                                Peeragarhi
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={472.751}
                            y={487.235}
                            className='PVW-PAGI PVE-PVW'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={472.751} y={487.235} dominantBaseline='middle' dy='0em'>
                                {'Paschim Vihar West\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={510.424}
                            y={501.635}
                            className='PVE-PVW MAPR-PVE'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={510.424} y={501.635} dominantBaseline='hanging' dy='0em'>
                                {'Paschim Vihar East\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={544.594}
                            y={487.235}
                            className='MAPR-PVE SHVP-MAPR'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={544.594} y={487.235} dominantBaseline='middle' dy='0em'>
                                Madipur
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={574.305}
                            y={501.635}
                            className='SHVP-MAPR PBGW-SHVP'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={574.305} y={501.635} dominantBaseline='hanging' dy='0em'>
                                Shivaji Park
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={625.407}
                            y={487.235}
                            className='PBGW-SHVP PBGA-PBGW PBGW-SAKP ESIH-PBGW'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={625.407} y={487.235} dominantBaseline='middle' dy='0em'>
                                {'Punjabi Bagh West\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={658.112}
                            y={501.635}
                            className='PBGA-PBGW APMN-PBGA'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={658.112} y={501.635} dominantBaseline='hanging' dy='0em'>
                                Punjabi Bagh
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={695.24}
                            y={494.435}
                            className='APMN-PBGA SRSM-APMN ILOK-APMN'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={695.24} y={494.435} dominantBaseline='middle' dy='0em'>
                                Ashok Park Main
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={700.431}
                            y={524.671}
                            className='SRSM-APMN KNR-SRSM'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={700.431} y={524.671} dominantBaseline='hanging' dy='0em'>
                                {'Satguru Ram Singh\n          '}
                            </tspan>
                            <tspan
                                x={700.431}
                                y={524.671}
                                dominantBaseline='hanging'
                                dy='1.1em'
                            >
                                Marg
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={969.191}
                            y={458.042}
                            className='LLQA-KG JAMD-LLQA'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={969.191} y={458.042} dominantBaseline='middle' dy='0em'>
                                Lal Quila
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={969.191}
                            y={479.607}
                            className='JAMD-LLQA DLIG-JAMD'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={969.191} y={479.607} dominantBaseline='middle' dy='0em'>
                                Jama Masjid
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={969.191}
                            y={492.96}
                            className='DLIG-JAMD ITO-DLIG'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={969.191} y={492.96} dominantBaseline='middle' dy='0em'>
                                Delhi Gate
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={969.191}
                            y={530.991}
                            className='ITO-DLIG MDHS-ITO'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={969.191} y={530.991} dominantBaseline='middle' dy='0em'>
                                ITO
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={969.191}
                            y={636.59}
                            className='JNPH-MDHS CTST-JNPH'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={969.191} y={636.59} dominantBaseline='middle' dy='0em'>
                                Janpath
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={910.957}
                            y={725.514}
                            className='KM-CTST JLNS-KM'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={910.957} y={725.514} dominantBaseline='middle' dy='0em'>
                                Khan Market
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={963.821}
                            y={738.936}
                            className='JLNS-KM JGPA-JLNS'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={963.821} y={738.936} dominantBaseline='middle' dy='0em'>
                                JLN Stadium
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={972.608}
                            y={763.245}
                            className='JGPA-JLNS LJPN-JGPA'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={972.608} y={763.245} dominantBaseline='middle' dy='0em'>
                                Jangpura
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={970.499}
                            y={794.749}
                            className='LJPN-JGPA MLCD-LJPN LJPN-SOEN VNPR-LJPN'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={970.499} y={794.749} dominantBaseline='hanging' dy='0em'>
                                Lajpat Nagar
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={972.141}
                            y={829.739}
                            className='MLCD-LJPN KHCY-MLCD'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={972.141} y={829.739} dominantBaseline='middle' dy='0em'>
                                Moolchand
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={972.456}
                            y={870.677}
                            className='KHCY-MLCD NP-KHCY'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={972.456} y={870.677} dominantBaseline='middle' dy='0em'>
                                Kailash Colony
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={972.781}
                            y={913.655}
                            className='NP-KHCY KJMD-NP'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={972.781} y={913.655} dominantBaseline='middle' dy='0em'>
                                Nehru Place
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={972.636}
                            y={967.787}
                            className='KJMD-NP GDPI-KJMD KJMD-NUEE OKNS-KJMD'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={972.636} y={967.787} dominantBaseline='hanging' dy='0em'>
                                Kalkaji Mandir
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={972.608}
                            y={992.635}
                            className='GDPI-KJMD HNOK-GDPI'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={972.608} y={992.635} dominantBaseline='middle' dy='0em'>
                                Govind Puri
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={972.608}
                            y={1014.384}
                            className='HNOK-GDPI JLA-HNOK'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={972.608} y={1014.384} dominantBaseline='middle' dy='0em'>
                                {'Harkesh Nagar Okhla\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={972.608}
                            y={1036.144}
                            className='JLA-HNOK STVR-JLA'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={972.608} y={1036.144} dominantBaseline='middle' dy='0em'>
                                Jasola Apollo
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={972.608}
                            y={1057.893}
                            className='STVR-JLA METE-STVR'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={972.608} y={1057.893} dominantBaseline='middle' dy='0em'>
                                Sarita Vihar
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={972.608}
                            y={1079.642}
                            className='METE-STVR TKDS-METE'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={972.608} y={1079.642} dominantBaseline='middle' dy='0em'>
                                Mohan Estate
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={972.608}
                            y={1093.288}
                            className='TKDS-METE BAPB-TKDS'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={972.608} y={1093.288} dominantBaseline='middle' dy='0em'>
                                {'Tughlakabad Station\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={972.608}
                            y={1123.151}
                            className='BAPB-TKDS SRAI-BAPB'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={972.608} y={1123.151} dominantBaseline='middle' dy='0em'>
                                {'Badarpur Border\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={972.608}
                            y={1144.91}
                            className='SRAI-BAPB NHPC-SRAI'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={972.608} y={1144.91} dominantBaseline='middle' dy='0em'>
                                Sarai
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={972.608}
                            y={1166.659}
                            className='NHPC-SRAI MMJR-NHPC'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={972.608} y={1166.659} dominantBaseline='middle' dy='0em'>
                                NHPC Chowk
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={972.608}
                            y={1188.408}
                            className='MMJR-NHPC STTA-MMJR'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={972.608} y={1188.408} dominantBaseline='middle' dy='0em'>
                                {'Mewala Maharajpur\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={972.608}
                            y={1210.168}
                            className='STTA-MMJR BKMR-STTA'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={972.608} y={1210.168} dominantBaseline='middle' dy='0em'>
                                Sector-28
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={972.608}
                            y={1231.917}
                            className='BKMR-STTA OFDB-BKMR'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={972.608} y={1231.917} dominantBaseline='middle' dy='0em'>
                                Badkal Mor
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={972.608}
                            y={1253.666}
                            className='OFDB-BKMR NCAJ-OFDB'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={972.608} y={1253.666} dominantBaseline='middle' dy='0em'>
                                Old Faridabad
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={972.608}
                            y={1275.426}
                            className='NCAJ-OFDB BACH-NCAJ'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={972.608} y={1275.426} dominantBaseline='middle' dy='0em'>
                                {'Neelam Chowk Ajronda\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={972.608}
                            y={1297.175}
                            className='BACH-NCAJ ECMJ-BACH'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={972.608} y={1297.175} dominantBaseline='middle' dy='0em'>
                                Bata Chowk
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={972.608}
                            y={1318.935}
                            className='ECMJ-BACH NCBC-ECMJ'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={972.608} y={1318.935} dominantBaseline='middle' dy='0em'>
                                Ecorts Mujesar
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={972.608}
                            y={1340.684}
                            className='NCBC-ECMJ BVHM-NCBC'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={972.608} y={1340.684} dominantBaseline='middle' dy='0em'>
                                {'Sant Surdas (Sihi)\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={972.608}
                            y={1362.433}
                            className='BVHM-NCBC'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={972.608} y={1357.433} dominantBaseline='middle' dy='0em'>
                                Raja Nahar
                            </tspan>
                            <tspan
                                x={972.608}
                                y={1357.433}
                                dominantBaseline='middle'
                                dy='1.1em'
                            >
                                {'Singh(Ballabgarh)\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={846.691}
                            y={281.935}
                            className='AZU-MKPR'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={846.691} y={281.935} dominantBaseline='middle' dy='0em'>
                                Majlis Park
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={746.895}
                            y={333.85}
                            className='SMBG-AZU NSHP-SMBG'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={746.895} y={333.85} dominantBaseline='middle' dy='0em'>
                                Shalimar Bagh
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={663.468}
                            y={431.737}
                            className='SAKP-NSHP PBGW-SAKP'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={663.468} y={431.737} dominantBaseline='middle' dy='0em'>
                                Shakurpur
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={619.693}
                            y={534.289}
                            className='ESIH-PBGW RG-ESIH'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={619.693} y={534.289} dominantBaseline='middle' dy='0em'>
                                {'ESI-Basaidarapur\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={630.877}
                            y={609.732}
                            className='MYPI-RG NAVR-MYPI'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={630.877} y={609.732} dominantBaseline='middle' dy='0em'>
                                Mayapuri
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={654.6}
                            y={669.523}
                            className='NAVR-MYPI DLIC-NAVR'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={654.6} y={669.523} dominantBaseline='middle' dy='0em'>
                                Naraina Vihar
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={693.911}
                            y={723.76}
                            className='DLIC-NAVR DDSC-DLIC'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={693.911} y={723.76} dominantBaseline='middle' dy='0em'>
                                Delhi Cantt
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={766.513}
                            y={765.443}
                            className='DDSC-DLIC SVMB-DDSC DDSC-DKV'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={766.513} y={760.443} dominantBaseline='middle' dy='0em'>
                                {'Durgabai Deshmukh\n          '}
                            </tspan>
                            <tspan
                                x={766.513}
                                y={760.443}
                                dominantBaseline='middle'
                                dy='1.1em'
                            >
                                {'South Campus\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={794.348}
                            y={778.839}
                            className='SVMB-DDSC BKCP-SVMB'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={794.348} y={773.839} dominantBaseline='middle' dy='0em'>
                                Sir M.
                            </tspan>
                            <tspan
                                x={794.348}
                                y={773.839}
                                dominantBaseline='middle'
                                dy='1.1em'
                            >
                                {'Vishweshwaraiah\n            Moti'}
                            </tspan>
                            <tspan
                                x={794.348}
                                y={773.839}
                                dominantBaseline='middle'
                                dy='2.2em'
                            >
                                Bagh
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={812.195}
                            y={799.381}
                            className='BKCP-SVMB SOJI-BKCP'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={812.195} y={799.381} dominantBaseline='hanging' dy='0em'>
                                {'Bhikaji Cama Place\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={851.072}
                            y={806.801}
                            className='SOJI-BKCP INA-SOJI'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={851.072} y={806.801} dominantBaseline='hanging' dy='0em'>
                                Sarojini Nagar
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={921.682}
                            y={809.029}
                            className='SOEN-INA LJPN-SOEN'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={921.682} y={809.029} dominantBaseline='hanging' dy='0em'>
                                South Extention
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1017.733}
                            y={774.114}
                            className='VNPR-LJPN AHRM-VNPR'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1017.733} y={774.114} dominantBaseline='middle' dy='0em'>
                                Vinobapuri
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1056.252}
                            y={749.284}
                            className='AHRM-VNPR NIZM-AHRM'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1056.252} y={749.284} dominantBaseline='middle' dy='0em'>
                                Ashram
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1082.871}
                            y={721.417}
                            className='NIZM-AHRM MVP1-NIZM'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1082.871} y={716.417} dominantBaseline='middle' dy='0em'>
                                {'Sarai Kale Khan\n          '}
                            </tspan>
                            <tspan
                                x={1082.871}
                                y={716.417}
                                dominantBaseline='middle'
                                dy='1.1em'
                            >
                                Nizamuddin
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1132.694}
                            y={650.649}
                            className='MVPO-MVP1 TKPR-MVPO'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1132.694} y={650.649} dominantBaseline='middle' dy='0em'>
                                {'Mayur Vihar Pocket-1\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1141.925}
                            y={626.177}
                            className='TKPR-MVPO VENT-TKPR'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1141.925} y={621.177} dominantBaseline='middle' dy='0em'>
                                {'Trilokpuri-Sanjay\n          '}
                            </tspan>
                            <tspan
                                x={1141.925}
                                y={621.177}
                                dominantBaseline='middle'
                                dy='1.1em'
                            >
                                Lake
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1149.073}
                            y={598.809}
                            className='VENT-TKPR VNNR-VENT'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1149.073} y={593.809} dominantBaseline='middle' dy='0em'>
                                {'East Vinod Nagar-\n          '}
                            </tspan>
                            <tspan
                                x={1149.073}
                                y={593.809}
                                dominantBaseline='middle'
                                dy='1.1em'
                            >
                                {'Mayur Vihar -II\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1153.683}
                            y={563.305}
                            className='VNNR-VENT IPE-VNNR'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1153.683} y={558.305} dominantBaseline='middle' dy='0em'>
                                {'Mandawali West Vinod\n          '}
                            </tspan>
                            <tspan
                                x={1153.683}
                                y={558.305}
                                dominantBaseline='middle'
                                dy='1.1em'
                            >
                                Nagar
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1153.683}
                            y={530.991}
                            className='IPE-VNNR AVIT-IPE'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1153.683} y={530.991} dominantBaseline='middle' dy='0em'>
                                IP Extension
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1130.074}
                            y={474.411}
                            className='KKDC-KKDA KHNA-KKDC'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={1130.074} y={474.411} dominantBaseline='middle' dy='0em'>
                                {'Karkarduma Court\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1118.727}
                            y={441.153}
                            className='KHNA-KKDC EANR-KHNA'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={1118.727} y={441.153} dominantBaseline='middle' dy='0em'>
                                Krishna Nagar
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1118.082}
                            y={411.485}
                            className='EANR-KHNA WC-EANR'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1118.082} y={411.485} dominantBaseline='middle' dy='0em'>
                                {'East Azad Nagar\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1102.722}
                            y={302.794}
                            className='JFRB-WC MUPR-JFRB'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1102.722} y={302.794} dominantBaseline='middle' dy='0em'>
                                Jafrabad
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1102.722}
                            y={246.876}
                            className='MUPR-JFRB GKPR-MUPR'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1102.722} y={246.876} dominantBaseline='middle' dy='0em'>
                                {'Maujpur-Babarpur\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1102.722}
                            y={190.947}
                            className='GKPR-MUPR JIEE-GKPR'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1102.722} y={190.947} dominantBaseline='middle' dy='0em'>
                                Gokulpuri
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1102.722}
                            y={135.028}
                            className='JIEE-GKPR SVVR-JIEE'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1102.722} y={135.028} dominantBaseline='middle' dy='0em'>
                                Johri Enclave
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1102.722}
                            y={79.099}
                            className='SVVR-JIEE'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1102.722} y={79.099} dominantBaseline='middle' dy='0em'>
                                Shiv Vihar
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={448.212}
                            y={618.757}
                            className='DBMR-JPW DSHP-DBMR'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={448.212} y={613.757} dominantBaseline='middle' dy='0em'>
                                {'Dabri Mor- Janakpuri\n          '}
                            </tspan>
                            <tspan x={448.212} y={613.757} dominantBaseline='middle' dy='1.1em'>
                                South
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={466.002}
                            y={689.081}
                            className='DSHP-DBMR PALM-DSHP'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={466.002} y={689.081} dominantBaseline='middle' dy='0em'>
                                Dashrathpuri
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={483.276}
                            y={759.296}
                            className='PALM-DSHP SABR-PALM'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={483.276} y={759.296} dominantBaseline='middle' dy='0em'>
                                Palam
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={530.495}
                            y={824.5}
                            className='SABR-PALM IGDA-SABR'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={530.495} y={819.5} dominantBaseline='middle' dy='0em'>
                                Sadar Bazar
                            </tspan>
                            <tspan x={530.495} y={819.5} dominantBaseline='middle' dy='1.1em'>
                                Cantonment
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={588.756}
                            y={878.694}
                            className='IGDA-SABR SKVR-IGDA'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={588.756} y={873.694} dominantBaseline='middle' dy='0em'>
                                Terminal-1 IGI
                            </tspan>
                            <tspan x={588.756} y={873.694} dominantBaseline='middle' dy='1.1em'>
                                Airport
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={669.928}
                            y={921.168}
                            className='SKVR-IGDA VTVR-SKVR'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={669.928} y={921.168} dominantBaseline='middle' dy='0em'>
                                Shankar Vihar
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={691.764}
                            y={930.812}
                            className='VTVR-SKVR MIRK-VTVR'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={691.764} y={930.812} dominantBaseline='middle' dy='0em'>
                                Vasant Vihar
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={714.576}
                            y={939.934}
                            className='MIRK-VTVR RKPM-MIRK'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={714.576} y={939.934} dominantBaseline='middle' dy='0em'>
                                Munirka
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={727.401}
                            y={958.643}
                            className='RKPM-MIRK IIT-RKPM'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={727.401} y={958.643} dominantBaseline='hanging' dy='0em'>
                                R K Puram
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={755.695}
                            y={953.066}
                            className='IIT-RKPM HKS-IIT'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={755.695} y={953.066} dominantBaseline='middle' dy='0em'>
                                IIT
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={813.392}
                            y={963.197}
                            className='PSPK-HKS CDLI-PSPK'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={813.392} y={963.197} dominantBaseline='middle' dy='0em'>
                                {'Panchsheel Park\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={856.63}
                            y={981.589}
                            className='CDLI-PSPK GKEI-CDLI'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={856.63} y={981.589} dominantBaseline='hanging' dy='0em'>
                                Chirag Delhi
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={911.138}
                            y={966.452}
                            className='GKEI-CDLI NUEE-GKEI'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={911.138} y={966.452} dominantBaseline='middle' dy='0em'>
                                {'Greater Kailash\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={939.005}
                            y={977.977}
                            className='NUEE-GKEI KJMD-NUEE'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={939.005} y={977.977} dominantBaseline='hanging' dy='0em'>
                                Nehru Enclave
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={995.054}
                            y={952.242}
                            className='OKNS-KJMD IWNR-OKNS'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={995.054} y={952.242} dominantBaseline='middle' dy='0em'>
                                Okhla NSIC
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1043.003}
                            y={950.138}
                            className='IWNR-OKNS JANR-IWNR'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1043.003} y={950.138} dominantBaseline='hanging' dy='0em'>
                                Sukhdev Vihar
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1090.02}
                            y={925.76}
                            className='JANR-IWNR OVA-JANR'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1090.02} y={925.76} dominantBaseline='middle' dy='0em'>
                                {'Jamia Millia Islamia\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1133.409}
                            y={900.03}
                            className='OVA-JANR JLA8-OVA'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1133.409} y={900.03} dominantBaseline='middle' dy='0em'>
                                Okhla Vihar
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1171.083}
                            y={871.871}
                            className='JLA8-OVA KIKJ-JLA8'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1171.083} y={866.871} dominantBaseline='middle' dy='0em'>
                                {'Jasola Vihar Shaheen\n          '}
                            </tspan>
                            <tspan
                                x={1171.083}
                                y={866.871}
                                dominantBaseline='middle'
                                dy='1.1em'
                            >
                                Bagh
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1202.898}
                            y={841.997}
                            className='KIKJ-JLA8 OKBS-KIKJ'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={1202.898} y={841.997} dominantBaseline='middle' dy='0em'>
                                Kalindi Kunj
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={1219.819}
                            y={804.32}
                            className='OKBS-KIKJ BCGN-OKBS'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={1219.819} y={804.32} dominantBaseline='middle' dy='0em'>
                                {'Okhla Bird Sanctuary\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={381.178}
                            y={828.299}
                            className='NNGI-DW NFGH-NNGI'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={381.178} y={828.299} dominantBaseline='middle' dy='0em'>
                                Nangli
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={359.483}
                            y={842.699}
                            className='NFGH-NNGI DNBT-NFGH'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={359.483} y={842.699} dominantBaseline='hanging' dy='0em'>
                                Najafgarh
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={330.588}
                            y={835.499}
                            className='DNBT-NFGH'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={330.588} y={835.499} dominantBaseline='middle' dy='0em'>
                                {'Dhansa Bus Stand\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={733.881}
                            y={777.273}
                            className='DDSC-DKV DKV-SJSU DACY-DKV'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={733.881} y={777.273} dominantBaseline='middle' dy='0em'>
                                Dhaula Kuan
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={818.646}
                            y={652.388}
                            className='SJSU-NDI DKV-SJSU'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={818.646} y={652.388} dominantBaseline='hanging' dy='0em'>
                                {'Shivaji Stadium\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={646.791}
                            y={949.195}
                            className='DACY-DKV APOT-DACY'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={646.791} y={949.195} dominantBaseline='hanging' dy='0em'>
                                Delhi Aerocity
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={560.63}
                            y={1099.236}
                            className='APOT-DACY DSTO-APOT'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={560.63} y={1099.236} dominantBaseline='hanging' dy='0em'>
                                Airport(T-3)
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={345.049}
                            y={1425.211}
                            className='IICC-DSTO'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={345.049} y={1425.211} dominantBaseline='hanging' dy='0em'>
                                {'Yashobhoomi Dwarka\n          '}
                            </tspan>
                            <tspan
                                x={345.049}
                                y={1425.211}
                                dominantBaseline='hanging'
                                dy='1.1em'
                            >
                                Sector - 25
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={718.499}
                            y={1194.057}
                            className='BEL-DL2 DL3-DL2 SKRP-DL2'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={718.499} y={1194.057} dominantBaseline='hanging' dy='0em'>
                                Phase-2
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={618.944}
                            y={1186.857}
                            className='BEL-DL2 GAT-BEL'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='end'
                        >
                            <tspan x={618.944} y={1186.857} dominantBaseline='middle' dy='0em'>
                                {'Belvedere Towers\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={643.248}
                            y={1122.673}
                            className='GAT-BEL MAL-GAT'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={643.248} y={1122.673} dominantBaseline='middle' dy='0em'>
                                Cyber City
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={646.223}
                            y={1078.256}
                            className='MAL-GAT DL3-MAL'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan
                                x={646.223}
                                y={1078.256}
                                dominantBaseline='middle'
                                dy='0em'
                            >
                                {'Moulsari Avenue\n          '}
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={711.391}
                            y={1102.551}
                            className='DL3-DL2 DL3-MAL'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={711.391} y={1102.551} dominantBaseline='middle' dy='0em'>
                                Phase-3
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={814.227}
                            y={1194.057}
                            className='PH1-SKRP SUL-PH1'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                            textAnchor='middle'
                        >
                            <tspan x={814.227} y={1194.057} dominantBaseline='hanging' dy='0em'>
                                Phase-1
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={891.545}
                            y={1186.857}
                            className='SUL-PH1 S53-SUL'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={891.545} y={1186.857} dominantBaseline='middle' dy='0em'>
                                Sector 42-43
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={891.545}
                            y={1263.158}
                            className='S53-SUL AIT-S53'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={891.545} y={1263.158} dominantBaseline='middle' dy='0em'>
                                Sector 53-54
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={891.545}
                            y={1312.796}
                            className='AIT-S53 S55-AIT'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={891.545} y={1312.796} dominantBaseline='middle' dy='0em'>
                                Sector 54 Chowk
                            </tspan>
                        </text>
                    </g>
                    <g className='label'>
                        <text
                            x={891.545}
                            y={1362.433}
                            className='S55-AIT'
                            dy={0}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                fontSize: 6,
                                userSelect: 'none',
                            }}
                        >
                            <tspan x={891.545} y={1362.433} dominantBaseline='middle' dy='0em'>
                                Sector 55-56
                            </tspan>
                        </text>
                    </g>
                </g>
                {train}
            </g>
        </svg>
    )
);
export default SvgComponent;
