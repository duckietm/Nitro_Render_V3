import { Point } from 'pixi.js';

export class PointMath
{
    public static sum(point1: Point, point2: Point): Point
    {
        return new Point((point1.x + point2.x), (point1.y + point2.y));
    }

    public static sub(point1: Point, point2: Point): Point
    {
        return new Point((point1.x - point2.x), (point1.y - point2.y));
    }

    public static mul(point: Point, factor: number): Point
    {
        return new Point((point.x * factor), (point.y * factor));
    }
}
