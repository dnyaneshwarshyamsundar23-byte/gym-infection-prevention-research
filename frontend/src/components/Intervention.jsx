import { useMemo, useState } from "react";
import { api } from "../api";

const modules = [
  {
    title: "What Is Cross-Infection?",
    icon: "🦠",
    image:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80",
    points: [
      "Cross-infection is the transfer of microorganisms from one person, object or surface to another.",
      "Shared hands, equipment and close contact can provide opportunities for transmission.",
      "Good hand hygiene, cleaning and personal hygiene help reduce risk.",
    ],
  },
  {
    title: "Common Gym-Related Infections",
    icon: "🏋️",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80",
    points: [
      "Skin and soft-tissue infections can spread through contact with people or contaminated surfaces.",
      "Fungal infections may spread through direct contact or contaminated items.",
      "Respiratory infections may spread more easily in crowded indoor settings.",
    ],
  },
  {
    title: "How Infection Spreads",
    icon: "🔄",
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
    points: [
      "Direct person-to-person contact.",
      "Contaminated hands and frequently touched surfaces.",
      "Shared exercise equipment and personal items.",
      "Respiratory exposure from coughing or sneezing.",
    ],
  },
  {
    title: "Hand Hygiene",
    icon: "🧼",
    image:
      "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=1200&q=80",
    points: [
      "Clean hands before and after activities where contamination is likely.",
      "Use soap and water when hands are visibly dirty.",
      "When appropriate, use an alcohol-based hand sanitizer.",
      "Avoid touching the eyes, nose and mouth with unclean hands.",
    ],
    resource:
      "https://www.who.int/europe/multi-media/item/who-how-to-handwash-with-soap-and-water",
    resourceText: "WHO: How to Handwash",
  },
  {
    title: "Equipment Cleaning & Disinfection",
    icon: "🧴",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
    points: [
      "Clean shared equipment according to the gym's procedure.",
      "Pay attention to high-touch surfaces and areas that contact bare skin.",
      "Use the appropriate product and follow its label instructions.",
      "Do not mix cleaning chemicals.",
    ],
    resource:
      "https://www.cdc.gov/hygiene/about/when-and-how-to-clean-and-disinfect-a-facility.html",
    resourceText: "CDC: Cleaning & Disinfection",
  },
  {
    title: "Personal Towels & Water Bottles",
    icon: "🧴",
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1200&q=80",
    points: [
      "Use your own towel and do not share it.",
      "Do not share personal water bottles or drinking containers.",
      "Keep personal items separate from other participants' belongings.",
      "Clean reusable items regularly.",
    ],
  },
  {
    title: "Clothing & Footwear",
    icon: "👟",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
    points: [
      "Wear clean workout clothing.",
      "Change out of sweaty clothing after exercise.",
      "Wash workout clothes regularly.",
      "Keep footwear clean and dry and avoid sharing it.",
    ],
  },
  {
    title: "Wound Care",
    icon: "🩹",
    image:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80",
    points: [
      "Keep cuts and abrasions clean.",
      "Cover open wounds with an appropriate clean dressing.",
      "Avoid exposing open wounds to shared surfaces.",
      "Seek appropriate healthcare advice for concerning wounds.",
    ],
    resource: "https://www.cdc.gov/mrsa/prevention/index.html",
    resourceText: "CDC: MRSA Prevention",
  },
  {
    title: "Respiratory Hygiene",
    icon: "😷",
    image:
      "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=1200&q=80",
    points: [
      "Cover coughs and sneezes with a tissue or your elbow.",
      "Clean hands after coughing, sneezing or blowing your nose.",
      "Avoid close contact with others when acutely ill.",
      "Improve ventilation where possible and follow current public-health guidance.",
    ],
    resource:
      "https://www.cdc.gov/respiratory-viruses/prevention/index.html",
    resourceText: "CDC: Respiratory Virus Prevention",
  },
  {
    title: "When to Avoid the Gym",
    icon: "🏠",
    image:
      "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80",
    points: [
      "Avoid attending when you are acutely ill and guidance recommends staying home.",
      "Be particularly cautious with fever or significant respiratory symptoms.",
      "Avoid exposing other participants to potentially contagious illness.",
      "Follow advice from a qualified healthcare professional when needed.",
    ],
    resource:
      "https://www.cdc.gov/respiratory-viruses/prevention/precautions-when-sick.html",
    resourceText: "CDC: When You Are Sick",
  },
  {
    title: "Personal Hygiene",
    icon: "🚿",
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1200&q=80",
    points: [
      "Maintain regular personal hygiene.",
      "Shower after workouts when appropriate.",
      "Keep skin clean and dry.",
      "Change sweaty clothing and keep towels and personal items clean.",
      "Cover cuts and abrasions.",
    ],
  },
  {
    title: "General Gym Infection-Prevention Measures",
    icon: "🛡️",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
    points: [
      "Clean hands regularly.",
      "Clean shared equipment appropriately.",
      "Use your own towel and water bottle.",
      "Wear clean clothing and keep footwear clean.",
      "Cover wounds and practise respiratory hygiene.",
      "Stay away from the gym when appropriately advised while ill.",
      "Maintain good personal hygiene.",
    ],
  },
];

export default function Intervention({ student, onComplete, onBack }) {
  const [completed, setCompleted] = useState(
    student.completed_modules || []
  );
  const [loading, setLoading] = useState(null);

  const progress = useMemo(
    () => Math.round((completed.length / modules.length) * 100),
    [completed]
  );

  async function completeModule(index) {
    const moduleNumber = index + 1;
    if (completed.includes(moduleNumber)) return;

    setLoading(moduleNumber);

    try {
      const result = await api.completeModule(moduleNumber);

      setCompleted((previous) =>
        previous.includes(moduleNumber)
          ? previous
          : [...previous, moduleNumber].sort((a, b) => a - b)
      );

      if (result.intervention_completed) {
        alert(
          "All 12 educational modules have been completed. Your post-test will open after 7 complete days."
        );
        onComplete();
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(null);
    }
  }

  return (
    <>
      <header className="topbar">
        <div className="brand">🛡️ Gym Infection Prevention</div>
        <button className="logout-button" onClick={onBack}>
          Dashboard
        </button>
      </header>

      <main className="container">
        <section className="welcome hero-card">
          <div>
            <span className="research-badge">STEP 2 — INTERVENTION</span>
            <h1>Learn, Practise & Protect</h1>
            <p>
              Read every standardized module and complete all 12 modules.
            </p>
          </div>
          <div className="progress-ring">{progress}%</div>
        </section>

        <section className="progress-card">
          <div className="progress-header">
            <strong>Intervention Progress</strong>
            <strong>{completed.length} / 12</strong>
          </div>
          <div className="progress-bar">
            <div style={{ width: `${progress}%` }} />
          </div>
          <p>{progress}% of the intervention completed.</p>
        </section>

        <section className="module-grid">
          {modules.map((item, index) => {
            const number = index + 1;
            const isCompleted = completed.includes(number);

            return (
              <article className="module-card" key={item.title}>
                <div className="module-image-wrap">
                  <img src={item.image} alt="" />
                  <span className="module-icon">{item.icon}</span>
                  <span className="module-number">MODULE {number}</span>
                </div>

                <div className="module-content">
                  <h2>{item.title}</h2>
                  <ul>
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>

                  {item.resource && (
                    <a
                      href={item.resource}
                      target="_blank"
                      rel="noreferrer"
                      className="resource-link"
                    >
                      🎥 / 📚 {item.resourceText}
                    </a>
                  )}

                  <button
                    className={`complete-button ${
                      isCompleted ? "completed" : ""
                    }`}
                    disabled={isCompleted || loading === number}
                    onClick={() => completeModule(index)}
                  >
                    {isCompleted
                      ? "✓ COMPLETED"
                      : loading === number
                        ? "SAVING..."
                        : "MARK AS COMPLETED"}
                  </button>
                </div>
              </article>
            );
          })}
        </section>

        {progress === 100 && (
          <section className="completion-card">
            <h2>🎉 Intervention Completed</h2>
            <p>
              All 12 standardized educational modules are recorded as
              completed.
            </p>
            <button className="primary-button" onClick={onComplete}>
              RETURN TO DASHBOARD
            </button>
          </section>
        )}
      </main>
    </>
  );
}
