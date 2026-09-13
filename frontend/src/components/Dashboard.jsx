import PostTestReminder from "./PostTestReminder";
import { api } from "../api";

// ======================================================
// GOOGLE FORM LINKS
// ======================================================

// Pre-test Google Form
const PRE_TEST_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSc-WVKiaZ91jb_7_6joVAV_uVXydHpnskiovXV529i2vJjWNg/viewform?usp=header";

// IMPORTANT:
// Replace this with your SEPARATE POST-TEST Google Form link.
const POST_TEST_URL =
  "https://docs.google.com/forms/d/e/YOUR_POST_TEST_FORM_ID/viewform";


export default function Dashboard({
  student,
  onRefresh,
  onIntervention,
  onLogout,
}) {

  // ======================================================
  // PRE-TEST
  // ======================================================

  function handlePretest() {
    if (student.pretest_completed) {
      return;
    }

    // Open Google Form in a new tab
    window.open(
      PRE_TEST_URL,
      "_blank",
      "noopener,noreferrer"
    );
  }


  // ======================================================
  // CONFIRM PRE-TEST SUBMISSION
  // ======================================================

  async function confirmPretestSubmission() {
    const confirmed = window.confirm(
      "Have you completed and submitted the pre-test Google Form?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.completePretest();

      // Refresh student information from backend
      await onRefresh();

      alert(
        "Pre-test completion recorded successfully. Your educational intervention is now unlocked."
      );

    } catch (error) {
      alert(
        error.message ||
        "Unable to record pre-test completion."
      );
    }
  }


  // ======================================================
  // POST-TEST
  // ======================================================

  function handlePosttest() {

    if (!student.post_test_available) {
      return;
    }

    if (student.posttest_completed) {
      return;
    }

    // Open post-test Google Form
    window.open(
      POST_TEST_URL,
      "_blank",
      "noopener,noreferrer"
    );
  }


  // ======================================================
  // CONFIRM POST-TEST SUBMISSION
  // ======================================================

  async function confirmPosttestSubmission() {

    const confirmed = window.confirm(
      "Have you completed and submitted the post-test Google Form?"
    );

    if (!confirmed) {
      return;
    }

    try {

      await api.completePosttest();

      await onRefresh();

      alert(
        "Post-test completion recorded successfully."
      );

    } catch (error) {

      alert(
        error.message ||
        "Unable to record post-test completion."
      );

    }
  }


  return (
    <>
      {/* ==================================================
          HEADER
      ================================================== */}

      <header className="topbar">

        <div className="brand">
          🛡️ Gym Infection Prevention
        </div>

        <button
          className="logout-button"
          onClick={onLogout}
        >
          Logout
        </button>

      </header>


      <main className="container">

        {/* ==================================================
            WELCOME
        ================================================== */}

        <section className="welcome hero-card">

          <div>

            <span className="research-badge">
              ACADEMIC RESEARCH PORTAL
            </span>

            <h1>
              Welcome, {student.name} 👋
            </h1>

            <p>
              Participant ID:{" "}
              <strong>
                {student.participant_id}
              </strong>
            </p>

          </div>

          <div className="participant-chip">
            Research Participant
          </div>

        </section>


        {/* ==================================================
            IMPORTANT NOTICE
        ================================================== */}

        <section className="notice-card">

          <strong>Important:</strong>{" "}

          Complete the three research steps in order.

          Your post-test will become available after
          completion of the educational intervention
          and the required 7-day waiting period.

        </section>


        {/* ==================================================
            RESEARCH JOURNEY
        ================================================== */}

        <section className="section">

          <h2>
            Your Research Journey
          </h2>


          <div className="journey-grid">


            {/* ==================================================
                STEP 1 — PRE-TEST
            ================================================== */}

            <div className="journey-card">

              <div className="step">
                1
              </div>

              <span className="card-kicker">
                BASELINE ASSESSMENT
              </span>

              <h3>
                Pre-Test
              </h3>


              <p>

                {student.pretest_completed

                  ? "Your pre-test completion has been recorded."

                  : "Complete the research questionnaire before starting the educational intervention."

                }

              </p>


              {/* START PRE-TEST */}

              {!student.pretest_completed && (

                <button
                  className="primary-button"
                  onClick={handlePretest}
                >
                  START PRE-TEST
                </button>

              )}


              {/* CONFIRM SUBMISSION */}

              {!student.pretest_completed && (

                <button
                  className="secondary-button"
                  onClick={confirmPretestSubmission}
                >
                  ✓ I HAVE COMPLETED AND SUBMITTED THE PRE-TEST
                </button>

              )}


              {/* COMPLETED */}

              {student.pretest_completed && (

                <button
                  className="primary-button"
                  disabled
                >
                  ✓ PRE-TEST COMPLETED
                </button>

              )}

            </div>



            {/* ==================================================
                STEP 2 — INTERVENTION
            ================================================== */}

            <div className="journey-card">

              <div className="step">
                2
              </div>

              <span className="card-kicker">
                STANDARDIZED INTERVENTION
              </span>

              <h3>
                Educational Intervention
              </h3>


              <p>

                {student.intervention_completed

                  ? "All 12 intervention modules are complete."

                  : student.pretest_completed

                    ? "Your pre-test is complete. You can now access the educational intervention."

                    : "Complete the pre-test first."

                }

              </p>


              <button

                className="primary-button"

                disabled={
                  !student.pretest_completed ||
                  student.intervention_completed
                }

                onClick={onIntervention}

              >

                {student.intervention_completed

                  ? "✓ INTERVENTION COMPLETED"

                  : student.pretest_completed

                    ? "🔓 OPEN INTERVENTION"

                    : "🔒 COMPLETE PRE-TEST FIRST"

                }

              </button>

            </div>



            {/* ==================================================
                STEP 3 — POST-TEST
            ================================================== */}

            <div className="journey-card">

              <div className="step">
                3
              </div>

              <span className="card-kicker">
                FOLLOW-UP ASSESSMENT
              </span>

              <h3>
                Post-Test
              </h3>


              <p>

                {student.posttest_completed

                  ? "Your post-test completion has been recorded."

                  : student.post_test_available

                    ? "The required 7-day waiting period is complete. You can now complete the post-test."

                    : "Locked until 7 complete days after intervention completion."

                }

              </p>


              {/* START POST TEST */}

              {student.post_test_available &&
                !student.posttest_completed && (

                  <button
                    className="primary-button"
                    onClick={handlePosttest}
                  >
                    🔓 START POST-TEST
                  </button>

              )}


              {/* CONFIRM POST TEST */}

              {student.post_test_available &&
                !student.posttest_completed && (

                  <button
                    className="secondary-button"
                    onClick={confirmPosttestSubmission}
                  >
                    ✓ I HAVE COMPLETED AND SUBMITTED THE POST-TEST
                  </button>

              )}


              {/* LOCKED */}

              {!student.post_test_available &&
                !student.posttest_completed && (

                  <button
                    className="primary-button"
                    disabled
                  >
                    🔒 LOCKED
                  </button>

              )}


              {/* COMPLETED */}

              {student.posttest_completed && (

                <button
                  className="primary-button"
                  disabled
                >
                  ✓ POST-TEST COMPLETED
                </button>

              )}

            </div>

          </div>

        </section>



        {/* ==================================================
            POST-TEST SCHEDULE
        ================================================== */}

        {student.intervention_completed &&
          !student.post_test_available &&
          student.post_test_available_at && (

            <section className="information-card">

              <h3>
                🔒 Post-Test Schedule
              </h3>

              <p>

                Your educational intervention is complete.

                The post-test will become available after
                the required 7 complete days.

              </p>

              <strong>

                Available:{" "}

                {new Date(
                  student.post_test_available_at
                ).toLocaleString()}

              </strong>

            </section>

        )}



        {/* ==================================================
            POST-TEST REMINDER
        ================================================== */}

        {student.post_test_available &&
          !student.posttest_completed && (

            <PostTestReminder
              onStart={handlePosttest}
            />

        )}



        {/* ==================================================
            RESEARCH INFORMATION
        ================================================== */}

        <section className="researcher-card">

          <h3>
            Research Information
          </h3>

          <p>
            <strong>Researcher:</strong>{" "}
            Mr. Rohan More, M.Sc. Nursing Student
          </p>

          <p>
            <strong>Department:</strong>{" "}
            Medical-Surgical Nursing
          </p>

          <p>
            <strong>Institution:</strong>{" "}
            Symbiosis College of Nursing, Pune
          </p>

          <p>
            <strong>Research Guide:</strong>{" "}
            Dr. Lija Prince, Associate Professor
          </p>

        </section>

      </main>


      {/* ==================================================
          FOOTER
      ================================================== */}

      <footer>

        <strong>
          Gym Infection Prevention Research Portal
        </strong>

        <br />

        Academic research participant platform

      </footer>

    </>
  );
}