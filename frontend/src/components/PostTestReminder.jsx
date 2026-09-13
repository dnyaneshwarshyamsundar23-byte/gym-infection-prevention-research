export default function PostTestReminder({ onStart }) {
  return (
    <section className="posttest-alert">
      <div className="notification-icon">🔔</div>
      <div>
        <span className="card-kicker">7-DAY FOLLOW-UP</span>
        <h2>Your Post-Test Is Now Available</h2>
        <p>
          Seven complete days have passed since you completed the educational
          intervention.
        </p>
        <button className="primary-button" onClick={onStart}>
          START POST-TEST
        </button>
      </div>
    </section>
  );
}
