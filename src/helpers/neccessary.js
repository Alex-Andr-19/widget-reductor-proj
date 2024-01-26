export function clamp(min, a, max) {
    if (a < min) return min;
    if (a > max) return max;
    return a
}