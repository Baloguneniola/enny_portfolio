import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import EnnyBot from './Ennybot';

const matrixChars =
    '010203040506070809101112131415161718192021222324252627282930313233343536373839404142434445464748495051525354555657585960616263646566676869707172737475767778798081828384858687888990919293949596979899;:=+-*&%$#@!?';
const fontSize = 15;

function Main() {
    const canvasRef = useRef(null);
    const cursorDotRef = useRef(null);
    const terminalRef = useRef(null);
    const getInTouchRef = useRef(null);
    const backToTopRef = useRef(null);
    const [showTerminal, setShowTerminal] = useState(false);
    const [showWelcome, setShowWelcome] = useState(true);
    const [animateWelcome, setAnimateWelcome] = useState(false);

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        const startAnimationTimer = setTimeout(() => {
            setAnimateWelcome(true);
        }, 50);

        const hideTimer = setTimeout(() => {
            setShowWelcome(false);
            document.body.style.overflow = 'auto';
            localStorage.setItem('welcomeSeen', 'true');
        }, 5000);

        return () => {
            document.body.style.overflow = 'auto';
            clearTimeout(startAnimationTimer);
            clearTimeout(hideTimer);
        };
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let cols = Math.floor(window.innerWidth / fontSize);
        let drops = Array(cols).fill(1);
        let animationFrameId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            cols = Math.floor(canvas.width / fontSize);
            drops = Array(cols).fill(1);
        };

        const drawMatrix = () => {
            ctx.fillStyle = 'rgba(10,14,23,0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#00d4ff';
            ctx.font = `${fontSize}px JetBrains Mono`;

            for (let i = 0; i < drops.length; i += 1) {
                const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                drops[i] += 1;
            }

            animationFrameId = requestAnimationFrame(drawMatrix);
        };

        resizeCanvas();
        drawMatrix();
        window.addEventListener('resize', resizeCanvas);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    useEffect(() => {
        const handleMouseMove = (event) => {
            if (cursorDotRef.current) {
                cursorDotRef.current.style.left = `${event.clientX}px`;
                cursorDotRef.current.style.top = `${event.clientY}px`;
            }
        };

        document.addEventListener('mousemove', handleMouseMove);
        return () => document.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => entry.target.classList.add('visible'), index * 80);
                    }
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (backToTopRef.current) {
                backToTopRef.current.classList.toggle('visible', window.scrollY > 400);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleMouseEnter = () => {
        setShowTerminal(true);
    };

    const handleMouseLeave = () => {
        setShowTerminal(false);
    };

    return (
        <div id="top" className="app-shell">
            {showWelcome && (
                <div className="welcome-overlay">
                    <div className="welcome-card">
                        <div className={`welcome-line welcome-line--wel ${animateWelcome ? 'active' : ''}`}>
                            WEL
                        </div>
                        <div className={`welcome-line welcome-line--come ${animateWelcome ? 'active' : ''}`}>
                            COME
                        </div>
                        <div className="welcome-subtitle">To my portfolio</div>
                    </div>
                </div>
            )}
            <canvas ref={canvasRef} id="matrix-canvas" />
            <div className="grid-bg" />

            <div className="code-float" style={{ top: '15%', left: '2%', opacity: 0.5 }}>
                const developer = {'{'}<br />
                &nbsp;name: "Eniola",<br />
                &nbsp;stack: ["React","Node","Flutter"],<br />
                &nbsp;building: true<br />
                {'};'}
            </div>

            <div
                className="code-float"
                style={{ bottom: '20%', right: '2%', opacity: 0.5, textAlign: 'right' }}
            >
                function solve(problem) {'{'}<br />
                &nbsp;if (!problem) return null;<br />
                &nbsp;return coffee + code;<br />
                {'}'}
            </div>

            <div className="cursor-dot" id="cursor-dot" ref={cursorDotRef} />

            <nav>
                <div className="nav-inner">
                    <a href="#top" className="nav-logo">
                        enny<span>.dev</span>
                    </a>
                    <ul className="nav-links">
                        <li>
                            <a href="#about">about</a>
                        </li>
                        <li>
                            <a href="#experience">experience</a>
                        </li>
                        <li>
                            <a href="#projects">projects</a>
                        </li>
                        <li>
                            <a href="#skills">skills</a>
                        </li>
                        <li>
                            <a href="#contact">contact</a>
                        </li>
                    </ul>
                </div>
            </nav>

            <section className="hero">
                <div className="container" style={{ position: 'relative' }}>
                    <div className="hero-inner">
                        <div className="hero-label">Available for opportunities</div>
                        <h1 className="hero-name">
                            <span className="line1">Eniola Gilgal</span>
                            <span className="line2">Balogun</span>
                        </h1>
                        <p className="hero-title">
                            Software Engineer
                            <span className="tag">AI/ML</span>
                            <span className="tag">Full-Stack</span>
                            <span className="tag">Mobile Dev</span>
                        </p>
                        <p className="hero-desc">
                            Software Engineering student at Babcock University, building practical
                            digital solutions from Lagos, Nigeria. Passionate about AI-powered
                            products, clean code, and technologies that make a real difference.
                        </p>
                        <div className="hero-ctas">
                            <a
                                href="#contact"
                                className="btn btn-primary"
                                id="get-in-touch"
                                ref={getInTouchRef}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <i className="fas fa-terminal" /> Get In Touch
                            </a>
                            <a href="#projects" className="btn btn-outline">
                                <i className="fas fa-code-branch" /> View Projects
                            </a>
                        </div>
                    </div>

                    <div
                        className="terminal-window"
                        ref={terminalRef}
                        style={{ display: showTerminal ? 'block' : 'none' }}
                    >
                        <div className="terminal-bar">
                            <span className="dot r" />
                            <span className="dot y" />
                            <span className="dot g" />
                            <span className="terminal-title">eniola.json</span>
                        </div>
                        <div className="terminal-body">
                            <div className="t-comment">{'// who is this person?'}</div>
                            <div>{'{'}</div>
                            <div>
                                &nbsp;&nbsp;<span className="t-key">"name"</span>:
                                <span className="t-str">"Eniola Gilgal, Balogun"</span>,
                            </div>
                            <div>
                                &nbsp;&nbsp;<span className="t-key">"role"</span>:
                                <span className="t-str">"Software Engineer"</span>,
                            </div>
                            <div>
                                &nbsp;&nbsp;<span className="t-key">"location"</span>:
                                <span className="t-str">"Lagos, Nigeria 🇳🇬"</span>,
                            </div>
                            <div>
                                &nbsp;&nbsp;<span className="t-key">"gpa"</span>:
                                <span className="t-num">4.30</span>,
                            </div>
                            <div>
                                &nbsp;&nbsp;<span className="t-key">"languages"</span>:
                                [<span className="t-str">"English"</span>,
                                <span className="t-str">"Yoruba"</span>],
                            </div>
                            <div>
                                &nbsp;&nbsp;<span className="t-key">"openToWork"</span>:
                                <span className="t-bool">true</span>,
                            </div>
                            <div>{'}'}<span className="t-cursor" /></div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="about">
                <div className="container">
                    <div className="section-header fade-up">
                        <div className="section-num">01 // about</div>
                        <h2 className="section-title">
                            About <span>Me</span>
                        </h2>
                        <div className="section-line" />
                    </div>
                    <div className="about-grid">
                        <div className="about-text fade-up">
                            <p>
                                I'm a goal-driven Software Engineering student at Babcock University
                                with strong interests in programming, artificial intelligence, and
                                full-stack development. Fluent in English and Yoruba, I bring sharp
                                analytical and written communication skills to everything I build.
                            </p>
                            <p>
                                From building AI-powered mobile apps to teaching kids how to code,
                                I love tackling real-world problems with clean, effective software.
                                I work independently, follow detailed guidelines, and always look to
                                improve.
                            </p>
                            <p>
                                Currently gaining hands-on experience as a Software Engineering
                                Intern at Ecobank, while developing my own startup product — One Drop,
                                a blood donation platform that uses AI and geolocation to connect
                                donors with recipients.
                            </p>
                            <div className="stat-grid">
                                <div className="stat-card">
                                    <div className="num">4.30</div>
                                    <div className="label">Current GPA / 5.0</div>
                                </div>
                                <div className="stat-card">
                                    <div className="num">30+</div>
                                    <div className="label">Students taught to code</div>
                                </div>
                                <div className="stat-card">
                                    <div className="num">3+</div>
                                    <div className="label">Years building software</div>
                                </div>
                                <div className="stat-card">
                                    <div className="num">∞</div>
                                    <div className="label">Problems left to solve</div>
                                </div>
                            </div>
                        </div>
                        <div className="fade-up">
                            <div className="edu-card">
                                <h3>Babcock University</h3>
                                <div className="degree">B.Sc. Software Engineering</div>
                                <div className="meta">
                                    Oct 2023 – Present&nbsp;·&nbsp;Ilishan-Remo, Nigeria
                                </div>
                                <div className="gpa-badge">
                                    <i className="fas fa-star" /> GPA: 4.30 / 5.0 — Progressively Improving
                                </div>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                                    Relevant Coursework:
                                </p>
                                <div className="course-tags">
                                    <span className="course-tag">Software Engineering</span>
                                    <span className="course-tag">Data Structures</span>
                                    <span className="course-tag">Artificial Intelligence</span>
                                    <span className="course-tag">Machine Learning</span>
                                    <span className="course-tag">OOP & Design</span>
                                    <span className="course-tag">Digital Logic</span>
                                    <span className="course-tag">C / C++</span>
                                    <span className="course-tag">Java</span>
                                    <span className="course-tag">Sys Analysis & Design</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section
                id="experience"
                style={{
                    background: 'linear-gradient(180deg, transparent, rgba(15, 22, 35, 0.5), transparent)',
                }}
            >
                <div className="container">
                    <div className="section-header fade-up">
                        <div className="section-num">02 // experience</div>
                        <h2 className="section-title">
                            Work <span>Experience</span>
                        </h2>
                        <div className="section-line" />
                    </div>
                    <div className="timeline">
                        <div className="tl-item fade-up">
                            <div className="tl-date">
                                Jan 2026 – Present<br />
                                <span style={{ color: 'var(--accent3)', fontSize: '11px' }}>Current</span>
                            </div>
                            <div className="tl-content">
                                <div className="tl-role">Software Engineering Intern</div>
                                <div className="tl-company">Ecobank Software Centre, eProcess</div>
                                <ul className="tl-bullets">
                                    <li>
                                        Participating in software engineering activities within a large corporate
                                        fintech environment
                                    </li>
                                    <li>
                                        Gaining exposure to enterprise-level systems, dev workflows, and
                                        professional software practices
                                    </li>
                                    <li>
                                        Collaborating with team members on technical tasks and real-world problem-solving
                                    </li>
                                </ul>
                                <div className="tag-row">
                                    <span className="tech-tag">Fintech</span>
                                    <span className="tech-tag">Enterprise Systems</span>
                                    <span className="tech-tag">Team Collaboration</span>
                                </div>
                            </div>
                        </div>

                        <div className="tl-item fade-up">
                            <div className="tl-date">
                                Jan 2025 – Present<br />
                                <span style={{ color: 'var(--accent3)', fontSize: '11px' }}>Founder</span>
                            </div>
                            <div className="tl-content">
                                <div className="tl-role">Founder & Developer</div>
                                <div className="tl-company">One Drop — AI Blood Donation App</div>
                                <ul className="tl-bullets">
                                    <li>
                                        Developing an AI-powered blood donation app using geolocation to connect donors and recipients in real time
                                    </li>
                                    <li>
                                        Designed core features: donor-recipient matching, health tracking, and emergency alert system
                                    </li>
                                    <li>
                                        Conducted user research to validate product-market fit and refine feature set
                                    </li>
                                </ul>
                                <div className="tag-row">
                                    <span className="tech-tag">Flutter/React-Native</span>
                                    <span className="tech-tag">AI/ML</span>
                                    <span className="tech-tag">Geolocation</span>
                                    <span className="tech-tag">Product Design</span>
                                </div>
                            </div>
                        </div>

                        <div className="tl-item fade-up">
                            <div className="tl-date">
                                May 2024 – Present<br />
                                <span style={{ color: 'var(--accent3)', fontSize: '11px' }}>Remote</span>
                            </div>
                            <div className="tl-content">
                                <div className="tl-role">AI Content Evaluator — Misinformation Analysis</div>
                                <div className="tl-company">CrowdGen (Appen)</div>
                                <ul className="tl-bullets">
                                    <li>
                                        Evaluating online content for potential misinformation and misleading narratives using structured guidelines
                                    </li>
                                    <li>
                                        Analyzing posts to determine accuracy and credibility, providing detailed written justifications
                                    </li>
                                    <li>
                                        Contributing to training and improving AI models for content moderation at scale
                                    </li>
                                </ul>
                                <div className="tag-row">
                                    <span className="tech-tag">AI Annotation</span>
                                    <span className="tech-tag">Data Labeling</span>
                                    <span className="tech-tag">Content Analysis</span>
                                </div>
                            </div>
                        </div>

                        <div className="tl-item fade-up">
                            <div className="tl-date">
                                Jul 2024 – Aug 2024 <br />
                                <span style={{ color: 'var(--accent3)', fontSize: '11px' }}>Part-time</span>
                            </div>
                            <div className="tl-content">
                                <div className="tl-role">Assistant Coding Instructor</div>
                                <div className="tl-company">In-depth Computers</div>
                                <ul className="tl-bullets">
                                    <li>
                                        Assisted in teaching basic programming to children during a summer tech bootcamp
                                    </li>
                                    <li>
                                        Helped students understand HTML, CSS, and JavaScript through hands-on, fun activities
                                    </li>
                                    <li>
                                        Successfully contributed to training over 30 children in foundational coding skills
                                    </li>
                                </ul>
                                <div className="tag-row">
                                    <span className="tech-tag">HTML/CSS</span>
                                    <span className="tech-tag">JavaScript</span>
                                    <span className="tech-tag">Teaching</span>
                                    <span className="tech-tag">Curriculum Design</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="projects">
                <div className="container">
                    <div className="section-header fade-up">
                        <div className="section-num">03 // projects</div>
                        <h2 className="section-title">
                            Featured <span>Projects</span>
                        </h2>
                        <div className="section-line" />
                    </div>
                    <div className="projects-grid">
                        <div className="project-card fade-up">
                            <div className="project-name">One Drop</div>
                            <p className="project-desc">
                                AI-powered blood donation app that connects donors and recipients in real time using geolocation.
                                Features health tracking, smart donor-recipient matching, and emergency alerts for urgent situations.
                            </p>
                            <div className="tag-row" style={{ marginBottom: '20px' }}>
                                <span className="tech-tag">React-Native</span>
                                <span className="tech-tag">AI/ML</span>
                                <span className="tech-tag">Geolocation API</span>
                            </div>
                            <a href="#projects" className="project-link">
                                <i className="fas fa-code-branch" /> In Development <i className="fas fa-arrow-right" />
                            </a>
                        </div>

                        <div className="project-card fade-up">
                            <div className="project-name">Student Management System (SMS)</div>
                            <p className="project-desc">
                                A web-based application for managing student records, courses, and grades. Built with a React front-end,
                                Java back-end, and PostgreSQL database. Features include user authentication, role-based access, and responsive design.
                            </p>
                            <div className="tag-row" style={{ marginBottom: '20px' }}>
                                <span className="tech-tag">React</span>
                                <span className="tech-tag">JAVA</span>
                                <span className="tech-tag">PostgreSQL</span>
                            </div>
                            <a
                                href="https://github.com/Baloguneniola"
                                target="_blank"
                                rel="noreferrer noopener"
                                className="project-link"
                            >
                                <i className="fab fa-github" /> View on GitHub <i className="fas fa-arrow-right" />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section
                id="skills"
                style={{
                    background: 'linear-gradient(180deg, transparent, rgba(15, 22, 35, 0.5), transparent)',
                }}
            >
                <div className="container">
                    <div className="section-header fade-up">
                        <div className="section-num">04 // skills</div>
                        <h2 className="section-title">
                            Technical <span>Skills</span>
                        </h2>
                        <div className="section-line" />
                    </div>
                    <div className="skills-grid">
                        <div className="skill-card fade-up">
                            <h3>
                                <i className="fas fa-globe" /> Front-End
                            </h3>
                            <div className="skill-pills">
                                <span className="pill">HTML</span>
                                <span className="pill">CSS</span>
                                <span className="pill">JavaScript</span>
                                <span className="pill">React</span>
                                <span className="pill">Tailwind CSS</span>
                                <span className="pill">Bootstrap</span>
                            </div>
                        </div>
                        <div className="skill-card fade-up">
                            <h3>
                                <i className="fas fa-server" /> Back-End & Database
                            </h3>
                            <div className="skill-pills">
                                <span className="pill">PHP</span>
                                <span className="pill">Node.js</span>
                                <span className="pill">Java</span>
                                <span className="pill">MySQL</span>
                                <span className="pill">PostgreSQL</span>
                            </div>
                        </div>
                        <div className="skill-card fade-up">
                            <h3>
                                <i className="fas fa-mobile-alt" /> Mobile Development
                            </h3>
                            <div className="skill-pills">
                                <span className="pill">Flutter</span>
                                <span className="pill">Dart</span>
                                <span className="pill">React Native</span>
                                <span className="pill">Android Studio</span>
                            </div>
                        </div>
                        <div className="skill-card fade-up">
                            <h3>
                                <i className="fas fa-code" /> Languages
                            </h3>
                            <div className="skill-pills">
                                <span className="pill">C</span>
                                <span className="pill">C++</span>
                                <span className="pill">Java</span>
                                <span className="pill">JavaScript</span>
                                <span className="pill">Python</span>
                                <span className="pill">PHP</span>
                                <span className="pill">Dart</span>
                            </div>
                        </div>
                        <div className="skill-card fade-up">
                            <h3>
                                <i className="fas fa-tools" /> Dev Tools
                            </h3>
                            <div className="skill-pills">
                                <span className="pill">Git</span>
                                <span className="pill">GitHub</span>
                                <span className="pill">VS Code</span>
                                <span className="pill">XAMPP</span>
                                <span className="pill">Android Studio</span>
                            </div>
                        </div>
                        <div className="skill-card fade-up">
                            <h3>
                                <i className="fas fa-palette" /> Design & Productivity
                            </h3>
                            <div className="skill-pills">
                                <span className="pill">Figma</span>
                                <span className="pill">Canva</span>
                                <span className="pill">Microsoft Office</span>
                                <span className="pill">AI Annotation</span>
                                <span className="pill">Data Labeling</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="contact">
                <div className="container">
                    <div className="contact-wrapper fade-up">
                        <h2>
                            Let's Build Something <span style={{ color: 'var(--accent)' }}>Together</span>
                        </h2>
                        <p>
                            I'm always open to discussing internships, collaborations, freelance
                            projects, or just having a good chat about tech and ideas.
                        </p>
                        <div className="contact-links">
                            <a href="mailto:beniola589@gmail.com" className="contact-link">
                                <i className="fas fa-envelope" /> beniola589@gmail.com
                            </a>
                            <a
                                href="https://www.linkedin.com/in/enny2580/"
                                target="_blank"
                                rel="noreferrer noopener"
                                className="contact-link"
                            >
                                <i className="fab fa-linkedin" /> linkedin.com/in/enny2580
                            </a>
                            <a href="tel:+2348108474435" className="contact-link">
                                <i className="fas fa-phone" /> +234 810 847 4435
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <footer>
                <div className="container">
                    <p>
                        {'// designed & built by '}<span style={{ color: 'var(--accent)' }}>Enny</span>
                    </p>
                </div>
            </footer>

            <a href="#top" id="back-to-top" ref={backToTopRef}>
                <i className="fas fa-chevron-up" />
            </a>

            <EnnyBot />
        </div>
    );
}

export default Main;