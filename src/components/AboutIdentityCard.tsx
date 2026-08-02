import { profile } from "../content/site";
import AboutContacts from "./AboutContacts";

/** Right-rail: portrait + contacts only (news sits with Projects). */
export default function AboutIdentityCard() {
  return (
    <aside className="about-profile-rail">
      <div className="about-portrait flex flex-col items-center text-center">
        <div className="about-avatar about-avatar--calm about-avatar--portrait">
          <div className="about-avatar__ring">
            <div className="about-avatar__photo">
              <img
                src={profile.aboutPhoto}
                alt={`Portrait of ${profile.name}`}
                className="about-avatar__img h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
        <div className="mt-1 w-full text-left">
          <AboutContacts stacked />
        </div>
      </div>
    </aside>
  );
}
