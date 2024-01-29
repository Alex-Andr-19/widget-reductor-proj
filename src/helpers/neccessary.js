export function clamp(min, a, max) {
    if (a < min) return min;
    if (a > max) return max;
    return a
}

export function collision(r1, r2) {
    return !(
        r2.x > r1.x + r1.width ||
        r2.x + r2.width < r1.x ||
        r2.y > r1.y + r1.height ||
        r2.y + r2.height < r1.y
    );
}