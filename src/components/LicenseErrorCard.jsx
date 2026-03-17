import React from 'react'
import PropTypes from 'prop-types'

const styles = {
  wrapper: {
    background: 'linear-gradient(180deg, #f4f4f4 0%, #ededed 100%)',
    minHeight: '100vh',
    padding: '14px 18px',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  card: {
    width: '480px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.35)',
    overflow: 'hidden',
  },
  header: {
    padding: '16px',
  },
  title: {
    margin: 0,
    color: '#1f1f1f',
    fontSize: '32px',
    lineHeight: '40px',
    fontWeight: 700,
    fontFamily: '"ABBvoice", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
  },
  content: {
    padding: '16px',
  },
  message: {
    margin: 0,
    color: '#1f1f1f',
    fontSize: '38px',
    lineHeight: '44px',
    fontWeight: 300,
    fontFamily: '"ABBvoice", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
  },
  actions: {
    padding: '16px',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '8px',
  },
  buttonBase: {
    height: '40px',
    borderRadius: '20px',
    padding: '0 12px',
    fontSize: '14px',
    lineHeight: '24px',
    fontWeight: 500,
    fontFamily: '"ABBvoice", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
    cursor: 'pointer',
  },
  cancelButton: {
    backgroundColor: '#ffffff',
    color: '#1f1f1f',
    border: '2px solid #dbdbdb',
  },
  retryButton: {
    backgroundColor: '#000000',
    color: '#ffffff',
    border: '2px solid #000000',
  },
}

function LicenseErrorCard({
  title = 'ABB Thin Client License Error',
  message = 'Maximum number of clients is exceeded. There are no licenses available at this point of time',
  cancelLabel = 'Cancel',
  retryLabel = 'Retry',
  onCancel,
  onRetry,
}) {
  return (
    <div style={styles.wrapper}>
      <dialog open style={styles.card} aria-label={title}>
        <div style={styles.header}>
          <h2 style={styles.title}>{title}</h2>
        </div>

        <div style={styles.content}>
          <p style={styles.message}>{message}</p>
        </div>

        <div style={styles.actions}>
          <button type="button" style={{ ...styles.buttonBase, ...styles.cancelButton }} onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" style={{ ...styles.buttonBase, ...styles.retryButton }} onClick={onRetry}>
            {retryLabel}
          </button>
        </div>
      </dialog>
    </div>
  )
}

LicenseErrorCard.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  cancelLabel: PropTypes.string,
  retryLabel: PropTypes.string,
  onCancel: PropTypes.func,
  onRetry: PropTypes.func,
}

export default LicenseErrorCard