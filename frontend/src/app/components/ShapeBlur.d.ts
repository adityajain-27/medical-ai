import React from 'react';

export interface ShapeBlurProps {
    className?: string;
    variation?: number;
    pixelRatioProp?: number;
    shapeSize?: number;
    roundness?: number;
    borderSize?: number;
    circleSize?: number;
    circleEdge?: number;
}

export default function ShapeBlur(props: ShapeBlurProps): JSX.Element;
