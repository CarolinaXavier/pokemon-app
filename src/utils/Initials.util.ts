export const Initials = (name: string) => {
    const names = name.split("-");
    if (names.length === 1) {
        return names[0].charAt(0).toUpperCase();
    } else {
        return (
            names[0].charAt(0) + names[names.length - 1].charAt(0)
        ).toUpperCase();
    }
};