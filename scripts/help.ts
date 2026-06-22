export const initHelp = async () => {
    const sections = document.querySelectorAll(".help-step");

    sections.forEach(section => {
        section.addEventListener("click", () => {
            sections.forEach(item => item.classList.remove("active"));

            section.classList.add("active");

            const target = section.getAttribute("data-target");

            if (!target) return;

            document
                .getElementById(target)
                ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
        });
    });

    sections[0]?.classList.add("active");
};
