import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaBell, FaCheckDouble } from 'react-icons/fa';
import {
  fetchNotifications, fetchUnreadCount, markNotificationRead, markAllNotificationsRead
} from '../features/notificationSlice';
import './NotificationBell.css';

const UNREAD_POLL_MS = 45000;

const describe = (notification) => {
  switch (notification.type) {
    case 'comment':
      return <><strong>{notification.actorUsername}</strong> commented on <strong>{notification.snippetTitle}</strong></>;
    case 'follow':
      return <><strong>{notification.actorUsername}</strong> started following you</>;
    case 'new_snippet':
      return <><strong>{notification.actorUsername}</strong> posted <strong>{notification.snippetTitle}</strong></>;
    default:
      return null;
  }
};

const notificationLink = (notification) => {
  if (notification.snippet) return `/snippet/${notification.snippet}`;
  if (notification.type === 'follow') return `/user/${encodeURIComponent(notification.actorUsername)}`;
  return null;
};

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const dispatch = useDispatch();
  const { items, unreadCount, loading } = useSelector(state => state.notifications);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (!user) return;
    dispatch(fetchUnreadCount());
    const interval = setInterval(() => dispatch(fetchUnreadCount()), UNREAD_POLL_MS);
    return () => clearInterval(interval);
  }, [dispatch, user]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!open) {
      dispatch(fetchNotifications({ page: 1 }));
    }
    setOpen((o) => !o);
  };

  const handleItemClick = (notification) => {
    if (!notification.read) {
      dispatch(markNotificationRead(notification._id));
    }
    setOpen(false);
  };

  if (!user) return null;

  return (
    <div className="notification-bell" ref={containerRef}>
      <button
        type="button"
        className="notification-bell-btn"
        onClick={handleToggle}
        aria-expanded={open}
        aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'}
      >
        <FaBell />
        {unreadCount > 0 && <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>}
      </button>

      {open && (
        <div className="notification-dropdown">
          <div className="notification-dropdown-header">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <button
                type="button"
                className="notification-mark-all"
                onClick={() => dispatch(markAllNotificationsRead())}
                title="Mark all as read"
              >
                <FaCheckDouble /> Mark all read
              </button>
            )}
          </div>

          <div className="notification-list">
            {loading && items.length === 0 ? (
              <p className="notification-empty">Loading...</p>
            ) : items.length === 0 ? (
              <p className="notification-empty">No notifications yet.</p>
            ) : (
              items.map((notification) => {
                const link = notificationLink(notification);
                const content = (
                  <>
                    <span className="notification-text">{describe(notification)}</span>
                    <span className="notification-time">{new Date(notification.createdAt).toLocaleString()}</span>
                  </>
                );
                return link ? (
                  <Link
                    key={notification._id}
                    to={link}
                    className={`notification-item ${notification.read ? '' : 'unread'}`}
                    onClick={() => handleItemClick(notification)}
                  >
                    {content}
                  </Link>
                ) : (
                  <div
                    key={notification._id}
                    role="button"
                    tabIndex={0}
                    className={`notification-item ${notification.read ? '' : 'unread'}`}
                    onClick={() => handleItemClick(notification)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleItemClick(notification); }}
                  >
                    {content}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
