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
    link: "/admin/dashboard",
  },
  {
    id: "activities",
    label: "Activity Logs",
    icon: "bx bx-history",
    link: "/admin/activity-logs",  
  },
{
    id: "users",
    label: "Users",
    icon: "bx bx-briefcase",
    link: "/admin/users",
    subItems: [
      {
        id: "users-list",
        label: "All Users",
        link: "/admin/users",
        parentId: "users",
      },
      {
        id: "add-new-user",
        label: "Add New User",
        link: "/admin/users/create",
        parentId: "users",
      },
      {
        id: "roles-permissions",
        label: "Roles & Permissions",
        link: "/admin/roles",
        parentId: "users",
      }
    ],
  },
  {
    id: "staff_management",
    label: "Staff Management",
    icon: "bx bx-group",
    subItems: [
      {
        id: "staff",
        label: "Staff Members",
        icon: "bx bx-user",
        link: "/admin/staff",
        subItems: [
          {
            id: "staff-list",
            label: "All Staff",
            link: "/admin/staff",
            parentId: "staff",
          },
          {
            id: "add-new-staff",
            label: "Add New Staff",
            link: "/admin/staff/create",
            parentId: "staff",
          },
          {
            id: "staff-reports",
            label: "Staff Reports",
            link: "/admin/staffs/reports",
            parentId: "staff",
          },
        ],
      },
      {
        id: "staff-schedules",
        label: "Schedules",
        icon: "bx bx-calendar",
        link: "/admin/staff-schedules",
        subItems: [
          {
            id: "staff-schedules-list",
            label: "Schedules",
            link: "/admin/staff-schedules",
            parentId: "staff-schedules",
          },
          // {
          //   id: "staff-schedules-calendar",
          //   label: "Calendar View",
          //   link: "/admin/staff-availability-calendar",
          //   parentId: "staff-schedules",
          // },
          {
            id: "add-new-staff-schedules",
            label: "Create Schedule",
            link: "/admin/staff-schedules/create",
            parentId: "staff-schedules",
          },
          {
            id: "bulk-staff-schedules",
            label: "Bulk Create",
            link: "/admin/staff-schedules/bulk-create",
            parentId: "staff-schedules",
          },
          // {
          //   id: "staff-schedules-conflicts",
          //   label: "Conflict Detection",
          //   link: "/admin/staff-availability/conflicts",
          //   parentId: "staff-schedules",
          // },
        ],
      },
      {
        id: "timeslots",
        label: "Timeslots",
        icon: "bx bx-calendar",
        link: "/admin/timeslots",
        subItems: [
          {
            id: "timeslots-list",
            label: "All Timeslots",
            link: "/admin/timeslots",
            parentId: "timeslots",
          },
          {
            id: "add-new-timeslot",
            label: "Add New Timeslot",
            link: "/admin/timeslots/create",
            parentId: "timeslots",
          },
          {
            id: "timeslots-bulk",
            label: "Bulk Create",
            link: "/admin/bulk-timeslots/create",
            parentId: "timeslots",
          },
        ],
      },
    ],
  },
  {
    id: "staff-leaves",
    label: "Staff Leaves",
    icon: "bx bx-calendar-event",
    link: "/admin/staff-leaves",
    subItems: [
        {
            id: "leaves-list",
            label: "All Leaves",
            link: "/admin/staff-leaves",
            parentId: "staff-leaves",
        },
        {
            id: "add-new-leave",
            label: "Add New Leave",
            link: "/admin/staff-leaves/create",
            parentId: "staff-leaves",
        },
    ],
  },
  {
    id: "services",
    label: "Services",
    icon: "bx bx-briefcase",
    link: "/admin/services",
    subItems: [
      {
        id: "services-list",
        label: "All Services",
        link: "/admin/services",
        parentId: "services",
      },
      {
        id: "add-new-service",
        label: "Add New Service",
        link: "/admin/services/create",
        parentId: "services",
      },
    ],
  },
  {
    id: "branches",
    label: "branches",
    icon: "bx bx-briefcase",
    link: "/admin/branches",
    subItems: [
      {
        id: "branches-list",
        label: "All branches",
        link: "/admin/branches",
        parentId: "branches",
      },
      {
        id: "add-new-branch",
        label: "Add New Branch",
        link: "/admin/branches/create",
        parentId: "branches",
      },
    ],
  },

  {
    id: "appointments",
    label: "Appointments",
    icon: "bx bx-calendar-check",
    link: "/admin/bookings",
    subItems: [
      {
        id: "appointments-list",
        label: "All Appointments",
        link: "/admin/bookings",
        parentId: "appointments",
      },
      {
        id: "add-new-appointment",
        label: "Book Appointment",
        link: "/admin/bookings/create",
        parentId: "appointments",
      },
      {
        id: "appointments-calendar",
        label: "Calendar View",
        link: "/admin/calendar",
        parentId: "appointments",
      },
      {
        id: "appointments-calendar-bookings",
        label: "Calendar View",
        link: "/admin/calendar/bookings",
        parentId: "appointments",
      },
    ],
  },

  {
    id: "reports",
    label: "Reports",
    icon: "bx bx-bar-chart-alt-2",
    subItems: [
      {
        id: "staff-reports",
        label: "Staff Reports",
        link: "/admin/reports/staff",
        parentId: "reports",
      },
      {
        id: "availability-reports",
        label: "Availability Reports",
        link: "/admin/reports/availability",
        parentId: "reports",
      },
      {
        id: "appointment-reports",
        label: "Appointment Reports",
        link: "/admin/reports/appointments",
        parentId: "reports",
      },
    ],
  },

  {
    id: "settings",
    label: "Settings",
    icon: "bx bx-cog",
    subItems: [
      {
        id: "general-settings",
        label: "General Settings",
        link: "/admin/settings/general",
        parentId: "settings",
      },
      {
        id: "business-hours",
        label: "Business Hours",
        link: "/admin/settings/business-hours",
        parentId: "settings",
      },
      {
        id: "notification-settings",
        label: "Notifications",
        link: "/admin/settings/notifications",
        parentId: "settings",
      },
    ],
  },
  
]
