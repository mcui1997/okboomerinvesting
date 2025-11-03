(function () {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector("body");
    const selectHeader = document.querySelector("#header");
    if (
      !selectHeader.classList.contains("scroll-up-sticky") &&
      !selectHeader.classList.contains("sticky-top") &&
      !selectHeader.classList.contains("fixed-top")
    )
      return;
    window.scrollY > 100
      ? selectBody.classList.add("scrolled")
      : selectBody.classList.remove("scrolled");
  }

  document.addEventListener("scroll", toggleScrolled);
  window.addEventListener("load", toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");

  function mobileNavToogle() {
    document.querySelector("body").classList.toggle("mobile-nav-active");
    mobileNavToggleBtn.classList.toggle("bi-list");
    mobileNavToggleBtn.classList.toggle("bi-x");
  }
  mobileNavToggleBtn.addEventListener("click", mobileNavToogle);

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll("#navmenu a").forEach((navmenu) => {
    navmenu.addEventListener("click", () => {
      if (document.querySelector(".mobile-nav-active")) {
        mobileNavToogle();
      }
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector(".scroll-top");

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100
        ? scrollTop.classList.add("active")
        : scrollTop.classList.remove("active");
    }
  }
  scrollTop.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  window.addEventListener("load", toggleScrollTop);
  document.addEventListener("scroll", toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }
  window.addEventListener("load", aosInit);

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener("load", function (e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: "smooth",
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll(".navmenu a");

  function navmenuScrollspy() {
    navmenulinks.forEach((navmenulink) => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
      ) {
        document
          .querySelectorAll(".navmenu a.active")
          .forEach((link) => link.classList.remove("active"));
        navmenulink.classList.add("active");
      } else {
        navmenulink.classList.remove("active");
      }
    });
  }
  window.addEventListener("load", navmenuScrollspy);
  document.addEventListener("scroll", navmenuScrollspy);
})();
/**
 * Dashboard Authentication Protection
 * Add this to the end of your main.js file
 */
(function () {
  "use strict";

  // Only run on dashboard page
  if (document.body.classList.contains("dashboard-page")) {
    checkDashboardAccess();
  }

  function checkDashboardAccess() {
    const token = sessionStorage.getItem("dashboard_token");
    const timestamp = sessionStorage.getItem("token_timestamp");

    // No token found - redirect to login
    if (!token || !timestamp) {
      redirectToLogin();
      return;
    }

    // Check if token has expired (24 hours)
    const tokenAge = Date.now() - parseInt(timestamp);
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    if (tokenAge >= maxAge) {
      // Token expired - clear and redirect
      sessionStorage.removeItem("dashboard_token");
      sessionStorage.removeItem("token_timestamp");
      redirectToLogin();
      return;
    }

    // Token is valid - user can access dashboard
    console.log("Dashboard access granted");
  }

  function redirectToLogin() {
    // Prevent any further page execution
    document.body.innerHTML = "";

    // Redirect to login page
    window.location.href = "dashboard-login.html";
  }
})();

/**
 * Portfolio Growth Chart
 */
(function () {
  "use strict";

  window.addEventListener("load", function () {
    const ctx = document.getElementById("portfolioChart");

    // Only initialize if we're on a page with the chart
    if (!ctx) return;

    new Chart(ctx, {
      type: "line",
      data: {
        labels: [
          "Jan 2021",
          "Mar 2021",
          "Jun 2021",
          "Sep 2021",
          "Dec 2021",
          "Mar 2022",
          "Jun 2022",
          "Sep 2022",
          "Dec 2022",
          "Mar 2023",
          "Jun 2023",
          "Sep 2023",
          "Dec 2023",
          "Mar 2024",
          "Jun 2024",
          "Sep 2024",
          "Dec 2024",
          "Mar 2025",
          "Jun 2025",
          "Sep 2025",
          "Nov 2025",
        ],
        datasets: [
          {
            label: "Portfolio Value",
            data: [
              0,
              8000,
              18000,
              12000,
              35000, // 2021: Started strong, lost $20k on bad trades (18k→12k), recovered
              42000,
              58000,
              48000,
              85000, // 2022: Growth, bear market dip (58k→48k), strong recovery
              110000,
              150000,
              180000,
              220000, // 2023: Bull run acceleration
              250000,
              290000,
              330000,
              360000, // 2024: Steady growth
              380000,
              400000,
              415000,
              425000,
            ], // 2025: Continuing upward
            borderColor: "#678d6b",
            backgroundColor: "rgba(103, 141, 107, 0.1)",
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 8,
            pointBackgroundColor: "#678d6b",
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            pointHitRadius: 15,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.5,
        interaction: {
          intersect: false,
          mode: "index",
        },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: "My Portfolio Journey",
            font: {
              size: 18,
              weight: "bold",
              family: "Raleway",
            },
            color: "#5f687b",
            padding: {
              top: 10,
              bottom: 20,
            },
          },
          tooltip: {
            backgroundColor: "rgba(95, 111, 123, 0.95)",
            padding: 12,
            titleFont: {
              size: 14,
              weight: "bold",
            },
            bodyFont: {
              size: 13,
            },
            callbacks: {
              title: function (context) {
                return context[0].label;
              },
              label: function (context) {
                return "Portfolio: $" + context.parsed.y.toLocaleString();
              },
            },
          },
          annotation: {
            annotations: {
              // Arrow and label for $20k loss
              lossArrow: {
                type: "line",
                xMin: 3,
                xMax: 3,
                yMin: 12000,
                yMax: 35000,
                borderColor: "#d32f2f",
                borderWidth: 2,
                borderDash: [5, 5],
              },
              loss: {
                type: "label",
                xValue: 3,
                yValue: 60000,
                content: ["Lost $20k", "learning"],
                font: {
                  size: 11,
                  weight: "bold",
                },
                color: "#d32f2f",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                padding: 8,
                borderRadius: 4,
                borderColor: "#d32f2f",
                borderWidth: 1,
              },
              // Arrow and label for bear market
              bearArrow: {
                type: "line",
                xMin: 7,
                xMax: 7,
                yMin: 48000,
                yMax: 80000,
                borderColor: "#d32f2f",
                borderWidth: 2,
                borderDash: [5, 5],
              },
              bearMarket: {
                type: "label",
                xValue: 7,
                yValue: 95000,
                content: ["2022 Bear", "Market"],
                font: {
                  size: 11,
                  weight: "bold",
                },
                color: "#d32f2f",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                padding: 8,
                borderRadius: 4,
                borderColor: "#d32f2f",
                borderWidth: 1,
              },
              // Arrow and label for system refined
              systemArrow: {
                type: "line",
                xMin: 11,
                xMax: 11,
                yMin: 180000,
                yMax: 240000,
                borderColor: "#678d6b",
                borderWidth: 2,
                borderDash: [5, 5],
              },
              systemRefined: {
                type: "label",
                xValue: 11,
                yValue: 250000,
                content: ["System refined", "Start of bull run"],
                font: {
                  size: 11,
                  weight: "bold",
                },
                color: "#678d6b",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                padding: 8,
                borderRadius: 4,
                borderColor: "#678d6b",
                borderWidth: 1,
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return "$" + value / 1000 + "k";
              },
              font: {
                size: 12,
              },
            },
            grid: {
              color: "rgba(0, 0, 0, 0.05)",
            },
          },
          x: {
            ticks: {
              callback: function (value, index) {
                const label = this.getLabelForValue(value);
                // Only show year labels at specific points
                if (label.includes("Jan 2021")) return "2021";
                if (label.includes("Jan 2022") || label.includes("Dec 2021"))
                  return "2022";
                if (label.includes("Dec 2022")) return "2023";
                if (label.includes("Dec 2023")) return "2024";
                if (label.includes("Dec 2024")) return "2025";
                return "";
              },
              font: {
                size: 12,
              },
              maxRotation: 0,
            },
            grid: {
              display: false,
            },
          },
        },
      },
    });
  });
})();
