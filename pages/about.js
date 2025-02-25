// about.js - Updated to fix hydration issue
import { useState } from 'react';
import Image from 'next/image';
import styles from '../styles/About.module.css';

export default function About() {
  const teamMembers = [
    {
      name: "Dr. John Doe",
      role: "President",
      bio: "Dr. John Doe has been leading the MITRA Society with a vision to promote education and community development. He has over 20 years of experience in educational leadership.",
      image: "/images/team/president.jpg"
    },
    {
      name: "Jane Smith",
      role: "Vice President",
      bio: "Jane Smith is dedicated to advancing the goals of the MITRA Society. She has a background in social work and community outreach.",
      image: "/images/team/vice-president.jpg"
    },
    {
      name: "Emily Johnson",
      role: "Secretary",
      bio: "Emily Johnson oversees the administrative functions of the MITRA Society, ensuring smooth operations and effective communication.",
      image: "/images/team/secretary.jpg"
    },
    {
      name: "Michael Brown",
      role: "Treasurer",
      bio: "Michael Brown manages the financial aspects of the MITRA Society, ensuring transparency and accountability in all financial matters.",
      image: "/images/team/treasurer.jpg"
    },
    {
      name: "Sarah Davis",
      role: "Head of Community Outreach",
      bio: "Sarah Davis leads the community outreach initiatives, fostering strong relationships with various stakeholders and community members.",
      image: "/images/team/outreach-head.jpg"
    }
  ];

  // Use a deterministic approach for committee roles
  const committeeRoles = [
    "Education Committee", "Education Committee", "Education Committee",
    "Outreach Committee", "Outreach Committee", "Outreach Committee",
    "Finance Committee", "Finance Committee", "Finance Committee",
    "Events Committee", "Events Committee", "Events Committee"
  ];
  
  const committeeMembers = Array.from({ length: 12 }, (_, index) => ({
    name: `Committee Member ${index + 1}`,
    role: committeeRoles[index]
  }));

  return (
    <div className={styles.pageContainer}>
      <header className={styles.heroSection}>
        <h1 className={styles.pageTitle}>About Us</h1>
      </header>

      <section className={styles.historySection}>
        <div className={styles.historyContent}>
          <h2 className={styles.sectionTitle}>Our History</h2>
          <p>
            The MITRA Society was founded in 2000 with the aim of promoting education and community 
            development in rural areas. What began as a small initiative by a group of passionate 
            educators and social workers has now grown into a respected organization with a significant impact.
          </p>
          <p>
            Over the past decade, MITRA has expanded its reach to over 20 villages, helping thousands 
            of children access quality education. Our commitment to creating sustainable change has 
            earned us recognition from various governmental and non-governmental organizations.
          </p>
          <p>
            Today, MITRA continues to evolve, adapting to the changing needs of the communities we serve 
            while staying true to our core mission of empowering rural communities through education.
          </p>
        </div>
        <div className={styles.historyImageContainer}>
          <Image 
            src="/images/about-history.jpg" 
            alt="MITRA History" 
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Our Work</h2>
        <p className={styles.workDescription}>
          At the MITRA Society, we are committed to providing educational opportunities, supporting community 
          development projects, and fostering a culture of learning and growth. Our holistic approach ensures 
          that we address not just educational needs but also contribute to the overall development of the communities we serve.
        </p>
        <div className={styles.workGrid}>
          <div className={styles.workCard}>
            <div className={styles.workIcon}>
              <i className="fas fa-book"></i>
            </div>
            <h3 className={styles.workCardTitle}>Education Initiatives</h3>
            <p>Providing quality education through our school and learning centers, scholarship programs, and teacher training.</p>
          </div>
          <div className={styles.workCard}>
            <div className={styles.workIcon}>
              <i className="fas fa-hands-helping"></i>
            </div>
            <h3 className={styles.workCardTitle}>Community Development</h3>
            <p>Working with local communities to address their needs through infrastructure development and capacity building.</p>
          </div>
          <div className={styles.workCard}>
            <div className={styles.workIcon}>
              <i className="fas fa-seedling"></i>
            </div>
            <h3 className={styles.workCardTitle}>Sustainable Practices</h3>
            <p>Promoting environmentally friendly practices and sustainable development within the communities we serve.</p>
          </div>
        </div>
      </section>

      <section className={styles.teamSection}>
        <h2 className={styles.sectionTitle}>Our Team</h2>
        <div className={styles.teamGrid}>
          {teamMembers.map((member, index) => (
            <div key={index} className={styles.teamMember}>
              <div className={styles.memberImageContainer}>
                <Image 
                  src={member.image} 
                  alt={member.name} 
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className={styles.memberInfo}>
                <h3 className={styles.memberName}>{member.name}</h3>
                <p className={styles.memberRole}>{member.role}</p>
                <p className={styles.memberBio}>{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.committeeSection}>
        <h2 className={styles.sectionTitle}>Committee Members</h2>
        <div className={styles.committeeGrid}>
          {committeeMembers.map((member, index) => (
            <div key={index} className={styles.committeeMember}>
              <h4 className={styles.committeeMemberName}>{member.name}</h4>
              <p className={styles.committeeMemberRole}>{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.schoolSection} id="sandeepani">
        <h2 className={styles.sectionTitle}>Sandeepani Gyan Kunj</h2>
        <div className={styles.schoolContent}>
          <div className={styles.schoolImageContainer}>
            <Image 
              src="/images/school-building.jpg" 
              alt="Sandeepani Gyan Kunj School" 
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className={styles.schoolInfo}>
            <h3 className={styles.schoolTitle}>Our School</h3>
            <p>
              Sandeepani Gyan Kunj is the flagship educational initiative of MITRA Society. Established in 2010,
              the school provides quality education to children from underprivileged backgrounds in rural areas.
            </p>
            <p>
              Our curriculum combines academic excellence with practical skills and values education. We believe in
              nurturing not just bright minds but also compassionate hearts and capable hands.
            </p>
            <p>
              The school is equipped with modern facilities including computer labs, a library, science laboratories,
              and sports facilities to ensure holistic development of our students.
            </p>
            <p>
              Through scholarships and subsidized fee structures, we ensure that financial constraints do not prevent
              any child from accessing quality education. Our dedicated teachers and staff work tirelessly to create
              a nurturing and stimulating learning environment.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.contactSection}>
        <h2 className={styles.contactTitle}>Get in Touch</h2>
        <p className={styles.contactDescription}>
          For more information about the MITRA Society, our projects, and how you can get involved,
          please reach out to us. We would love to hear from you!
        </p>
        <a href="/contact" className={styles.contactButton}>
          Contact Us
        </a>
      </section>
    </div>
  );
}