export const BackgroundColor = () => {
    const colors = [
        "bg-green-500",
        "bg-red-500",
        "bg-blue-500",
        "bg-yellow-500",
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    return randomColor;
};