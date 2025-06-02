// Convert the menu items to work with Inertia.js routes
export const menuItems = [
  {
    id: "menu",
    label: "Menu",
    isHeader: true,
  },
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "bx bx-home-circle",
    link: "/dashboard",
    badge: 3,
    badgecolor: "bg-primary",
  },
  {
    id: "calendar",
    label: "Calendar",
    icon: "bx bx-calendar",
    link: "/calendar",
  },
  {
    id: "email",
    label: "Email",
    icon: "mdi mdi-email-outline",
    link: "#",
    subItems: [
      {
        id: "inbox",
        label: "Inbox",
        link: "/inbox",
        parentId: "email",
      },
      {
        id: "reademail",
        label: "Read Email",
        link: "/read-email",
        parentId: "email",
      },
      {
        id: "composeemail",
        label: "Email Compose",
        link: "/compose-email",
        parentId: "email",
      },
    ],
  },
  // Add more menu items as needed...
];