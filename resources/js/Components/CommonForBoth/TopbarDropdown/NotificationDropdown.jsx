import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { Link, usePage } from "@inertiajs/react";
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col, Badge } from "reactstrap";
import SimpleBar from "simplebar-react";
import { useEcho } from "@/hooks/useEcho";
import { Inertia } from "@inertiajs/inertia";

// Import images
import avatar3 from "@/assets/images/users/avatar-3.jpg";
import avatar4 from "@/assets/images/users/avatar-4.jpg";
import bookingIcon from "@/assets/images/users/avatar-3.jpg";

// i18n
import { useTranslation } from "react-i18next";

const NotificationDropdown = () => {
  const [menu, setMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { t } = useTranslation();
  const echo = useEcho();
  const { props } = usePage();

  // Initialize with server-side notifications
  useEffect(() => {
    if (props.notifications) {
      setNotifications(props.notifications);
      setUnreadCount(props.unreadCount || 0);
    }
  }, [props.notifications, props.unreadCount]);

  // Listen for real-time notifications
  useEffect(() => {
    if (!echo) return;

    // Listen for new booking notifications (admin channel)
    const channel = echo.private(`admin.bookings`);
    
    channel.listen('.booking.created', (data) => {
      const newNotification = {
        id: `temp-${Date.now()}`,
        type: 'booking.created',
        data: {
          message: 'New booking received',
          bookingId: data.booking.id,
          customerName: data.booking.customer?.name || 'Guest',
        },
        read_at: null,
        created_at: new Date().toISOString(),
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => {
      channel.stopListening('.booking.created');
    };
  }, [echo]);

  const markAsRead = (id) => {
    // Optimistic UI update
    setNotifications(prev => 
      prev.map(n => n.id === id ? {...n, read_at: new Date().toISOString()} : n)
    );
    setUnreadCount(prev => prev > 0 ? prev - 1 : 0);
    
    // Server update
    Inertia.post(`/notifications/${id}/mark-as-read`, {}, {
      preserveState: true,
      onError: () => {
        // Revert if error
        setNotifications(prev => 
          prev.map(n => n.id === id ? {...n, read_at: null} : n)
        );
        setUnreadCount(prev => prev + 1);
      }
    });
  };

  const markAllAsRead = () => {
    // Optimistic UI update
    setNotifications(prev => 
      prev.map(n => ({...n, read_at: n.read_at || new Date().toISOString()}))
    );
    setUnreadCount(0);
    
    // Server update
    Inertia.post('/notifications/mark-all-as-read', {}, {
      preserveState: true,
      onError: () => {
        // Revert if error
        setNotifications(prev => 
          prev.map(n => ({...n, read_at: n.read_at === null ? null : n.read_at}))
        );
        setUnreadCount(prev => 
          prev + notifications.filter(n => !n.read_at).length
        );
      }
    });
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'booking.created':
        return <img src={bookingIcon} className="me-3 rounded-circle avatar-xs" alt="booking" />;
      default:
        return (
          <span className="avatar-title bg-primary rounded-circle font-size-16">
            <i className="bx bx-bell" />
          </span>
        );
    }
  };

  const getNotificationLink = (notification) => {
    if (notification.type === 'booking.created') {
      return `/admin/bookings/${notification.data.bookingId}`;
    }
    return '#';
  };

  const formatNotificationTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return t('Just now');
    if (diffInMinutes < 60) return t('{{count}} min ago', { count: diffInMinutes });
    if (diffInMinutes < 1440) return t('{{count}} hours ago', { count: Math.floor(diffInMinutes / 60) });
    return date.toLocaleDateString();
  };

  return (
    <Dropdown
      isOpen={menu}
      toggle={() => setMenu(!menu)}
      className="dropdown d-inline-block"
      tag="li"
    >
      <DropdownToggle
        className="btn header-item noti-icon position-relative"
        tag="button"
        id="page-header-notifications-dropdown"
      >
        <i className="bx bx-bell bx-tada" />
        {unreadCount > 0 && (
          <span className="badge bg-danger rounded-pill">{unreadCount}</span>
        )}
      </DropdownToggle>

      <DropdownMenu className="dropdown-menu dropdown-menu-lg p-0 dropdown-menu-end">
        <div className="p-3">
          <Row className="align-items-center">
            <Col>
              <h6 className="m-0">{t("Notifications")} {unreadCount > 0 && (
                <Badge color="primary" pill>{unreadCount}</Badge>
              )}</h6>
            </Col>
            <div className="col-auto">
              <Link 
                href="#" 
                className="small"
                onClick={(e) => {
                  e.preventDefault();
                  markAllAsRead();
                }}
              >
                {t("Mark all as read")}
              </Link>
            </div>
          </Row>
        </div>

        <SimpleBar style={{ height: "230px" }}>
          {notifications.length === 0 ? (
            <div className="text-center py-4 text-muted">
              {t("No notifications")}
            </div>
          ) : (
            notifications.slice(0, 5).map(notification => (
              <Link 
                href={getNotificationLink(notification)}
                className={`text-reset notification-item ${!notification.read_at ? 'unread' : ''}`}
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="d-flex">
                  <div className="flex-shrink-0 me-3">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mt-0 mb-1">
                      {notification.type === 'booking.created' 
                        ? t('New Booking from {{name}}', { name: notification.data.customerName })
                        : notification.data.message}
                    </h6>
                    <div className="font-size-12 text-muted">
                      {notification.data.description && (
                        <p className="mb-1">{notification.data.description}</p>
                      )}
                      <p className="mb-0">
                        <i className="mdi mdi-clock-outline" />{" "}
                        {formatNotificationTime(notification.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </SimpleBar>
        
        <div className="p-2 border-top d-grid">
          <Link
            className="btn btn-sm btn-link font-size-14 btn-block text-center"
            href="/notifications"
          >
            <i className="mdi mdi-arrow-right-circle me-1"></i>
            {t("View all")}
          </Link>
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};

NotificationDropdown.propTypes = {
  t: PropTypes.any,
};

export default NotificationDropdown;