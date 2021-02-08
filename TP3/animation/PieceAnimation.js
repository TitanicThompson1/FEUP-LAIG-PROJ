const CURVE_HEIGHT = 0.5;

class PieceAnimation extends CurveAnim {
    constructor(scene, previousPosition, nextPosition, speed) {

        let nullTransl = [0, 0, 0];
        let nullScale = [1, 1, 1];
        let nullRotation = [0, 0, 0];

        // Movement of the piece (relative to end and start position)
        let movement = [nextPosition[0] - previousPosition[0], nextPosition[1] - previousPosition[1], nextPosition[2] - previousPosition[2]];

        // First keyframe of the animation
        let startKF = new KeyFrame(0, [nullTransl, nullRotation, nullRotation, nullRotation, nullScale]);

        // Last keyframe of the animation
        let lastKF = new KeyFrame((Utils.calculateDistance(movement)) / speed, [movement, nullRotation, nullRotation, nullRotation, nullScale]);

        super(scene, [startKF, lastKF], CURVE_HEIGHT + nextPosition[1]);

    }

    update(currentTime) {
        super.update(currentTime);
        return super.ended();
    }
}