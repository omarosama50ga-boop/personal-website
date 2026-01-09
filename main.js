       // ===== التهيئة الأساسية =====
        document.addEventListener('DOMContentLoaded', function() {
            // تحديث سنة حقوق النشر
            document.getElementById('currentYear').textContent = new Date().getFullYear();
            
            // تهيئة العناصر
            const navLinks = document.querySelectorAll('.nav-link');
            const sections = document.querySelectorAll('.section');
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            const navMenu = document.getElementById('navMenu');
            const themeSwitch = document.getElementById('checkbox');
            
            // ===== Dark/Light Mode =====
            function initializeTheme() {
                const savedTheme = localStorage.getItem('theme') || 'light';
                if (savedTheme === 'dark') {
                    document.body.classList.add('dark-mode');
                    themeSwitch.checked = true;
                } else {
                    document.body.classList.remove('dark-mode');
                    themeSwitch.checked = false;
                }
            }
            
            function toggleTheme() {
                if (document.body.classList.contains('dark-mode')) {
                    document.body.classList.remove('dark-mode');
                    localStorage.setItem('theme', 'light');
                } else {
                    document.body.classList.add('dark-mode');
                    localStorage.setItem('theme', 'dark');
                }
            }
            
            themeSwitch.addEventListener('change', toggleTheme);
            initializeTheme();
            
            // ===== تهيئة localStorage =====
            function initializeLocalStorage() {
                if (!localStorage.getItem('omar')) {
                    const initialData = {
                        lastVisitedSection: 'home',
                        visitedSections: ['home'],
                        serviceRequests: [],
                        theme: 'light'
                    };
                    localStorage.setItem('omar', JSON.stringify(initialData));
                    return initialData;
                }
                
                try {
                    return JSON.parse(localStorage.getItem('omar'));
                } catch (e) {
                    const initialData = {
                        lastVisitedSection: 'home',
                        visitedSections: ['home'],
                        serviceRequests: [],
                        theme: 'light'
                    };
                    localStorage.setItem('omar', JSON.stringify(initialData));
                    return initialData;
                }
            }
            
            // تحميل حالة الموقع من localStorage
            const siteData = initializeLocalStorage();
            const lastVisitedSection = siteData.lastVisitedSection || 'home';
            
            // عرض القسم الأخير الذي زاره المستخدم
            showSection(lastVisitedSection);
            setActiveNavLink(lastVisitedSection);
            
            // ===== أحداث التنقل =====
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const sectionId = link.getAttribute('data-section');
                    
                    // إظهار القسم المحدد
                    showSection(sectionId);
                    
                    // تحديث حالة الرابط النشط
                    setActiveNavLink(sectionId);
                    
                    // تحديث localStorage
                    updateLocalStorage(sectionId);
                    
                    // إغلاق القائمة المتنقلة على الأجهزة الصغيرة فقط
                    if (window.innerWidth <= 768) {
                        closeMobileMenu();
                    }
                });
            });
            
            // ===== وظائف التنقل =====
            function showSection(sectionId) {
                sections.forEach(section => {
                    section.classList.remove('active');
                });
                
                const targetSection = document.getElementById(sectionId);
                if (targetSection) {
                    targetSection.classList.add('active');
                    // التمرير إلى أعلى القسم
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
            
            function setActiveNavLink(sectionId) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    }
                });
            }
            
            function updateLocalStorage(sectionId) {
                const siteData = initializeLocalStorage();
                siteData.lastVisitedSection = sectionId;
                
                if (!siteData.visitedSections.includes(sectionId)) {
                    siteData.visitedSections.push(sectionId);
                }
                
                localStorage.setItem('omar', JSON.stringify(siteData));
            }
            
            // ===== إدارة القائمة المتنقلة =====
            function closeMobileMenu() {
                navMenu.classList.remove('show');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                mobileMenuBtn.style.transform = 'rotate(0)';
            }
            
            function toggleMobileMenu() {
                if (window.innerWidth <= 768) {
                    navMenu.classList.toggle('show');
                    
                    if (navMenu.classList.contains('show')) {
                        mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
                        mobileMenuBtn.style.transform = 'rotate(180deg)';
                    } else {
                        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                        mobileMenuBtn.style.transform = 'rotate(0)';
                    }
                }
            }
            
            // حدث النقر على زر القائمة
            mobileMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleMobileMenu();
            });
            
            // إغلاق القائمة عند النقر على رابط
            document.querySelectorAll('#navMenu a').forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth <= 768) {
                        closeMobileMenu();
                    }
                });
            });
            
            // إغلاق القائمة عند النقر خارجها
            document.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    if (!e.target.closest('nav') && !e.target.closest('#mobileMenuBtn')) {
                        closeMobileMenu();
                    }
                }
            });
            
            // عند تغيير حجم النافذة
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768) {
                    closeMobileMenu();
                }
            });
            
            // ===== طلبات الخدمات والواتساب =====
            const whatsappButtons = document.querySelectorAll('.whatsapp-btn');
            whatsappButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    let serviceText = 'خدمة أخرى';
                    let originalText = this.innerHTML;
                    
                    if (this.closest('.service-card')) {
                        serviceText = this.closest('.service-card').querySelector('h3').textContent;
                    } else if (this.closest('.qr-service-card')) {
                        serviceText = this.closest('.qr-service-card').querySelector('h3').textContent;
                    } else if (this.closest('.other-service')) {
                        serviceText = 'خدمة أخرى';
                    }
                    
                    // إنشاء رسالة النجاح
                    const successMessage = document.createElement('div');
                    successMessage.className = 'success-message';
                    successMessage.innerHTML = `
                        <span style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                            <i class="fas fa-check-circle" style="font-size: 1.3rem;"></i>
                            جاري فتح الواتساب... 🚀
                        </span>
                    `;
                    
                    this.appendChild(successMessage);
                    this.style.overflow = 'hidden';
                    successMessage.style.display = 'flex';
                    
                    // حفظ طلب الخدمة في localStorage
                    const siteData = initializeLocalStorage();
                    siteData.serviceRequests.push({
                        service: serviceText,
                        timestamp: new Date().toISOString()
                    });
                    
                    localStorage.setItem('omar', JSON.stringify(siteData));
                    
                    // فتح الواتساب بعد تأخير 0.5 ثانية
                    setTimeout(() => {
                        const whatsappUrl = `https://wa.me/201556527636?text=أريد خدمة: ${encodeURIComponent(serviceText)}`;
                        window.open(whatsappUrl, '_blank');
                        
                        // تغيير رسالة النجاح
                        successMessage.innerHTML = `
                            <span style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                                <i class="fas fa-check-circle" style="font-size: 1.3rem;"></i>
                                تم فتح الواتساب! ✅
                            </span>
                        `;
                    }, 500);
                    
                    // إعادة الزر إلى حالته الأصلية بعد 2 ثواني
                    setTimeout(() => {
                        successMessage.style.display = 'none';
                        this.innerHTML = originalText;
                        this.style.backgroundColor = '';
                    }, 2000);
                });
            });
            
            // ===== تأثيرات التمرير =====
            let lastScrollTop = 0;
            let ticking = false;
            const header = document.querySelector('header');
            
            window.addEventListener('scroll', () => {
                const st = window.pageYOffset || document.documentElement.scrollTop;
                
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        // تأثير التظليل
                        if (st > 50) {
                            header.classList.add('scroll-shadow');
                            header.classList.add('header-scrolled');
                        } else {
                            header.classList.remove('scroll-shadow');
                            header.classList.remove('header-scrolled');
                        }
                        
                        // إخفاء الهيدر عند التمرير لأسفل
                        if (st > lastScrollTop && st > 100) {
                            header.classList.add('header-hidden');
                        } else {
                            header.classList.remove('header-hidden');
                        }
                        
                        lastScrollTop = st <= 0 ? 0 : st;
                        ticking = false;
                    });
                    
                    ticking = true;
                }
                
                // إضافة تأثيرات على العناصر عند الظهور
                const serviceCards = document.querySelectorAll('.service-card, .qr-service-card, .work-item');
                serviceCards.forEach(card => {
                    const cardPosition = card.getBoundingClientRect().top;
                    const screenPosition = window.innerHeight / 1.2;
                    
                    if (cardPosition < screenPosition) {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }
                });
            }, { passive: true });
            
            // ===== تأثيرات عند التحميل =====
            window.addEventListener('load', () => {
                document.body.style.opacity = '0';
                document.body.style.transition = 'opacity 0.8s ease';
                
                setTimeout(() => {
                    document.body.style.opacity = '1';
                }, 200);
                
                // تحميل الصور
                const images = document.querySelectorAll('img');
                images.forEach(img => {
                    if (img.complete) {
                        img.classList.add('loaded');
                    } else {
                        img.addEventListener('load', function() {
                            this.classList.add('loaded');
                        });
                    }
                });
                
                // إعداد تأثيرات على العناصر
                const animatedElements = document.querySelectorAll('.service-card, .qr-service-card, .work-item');
                animatedElements.forEach((element, index) => {
                    element.style.opacity = '0';
                    element.style.transform = 'translateY(30px)';
                    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    
                    setTimeout(() => {
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                    }, 200 + (index * 100));
                });
            });
            
            // ===== تحسين الصور =====
            const serviceImages = document.querySelectorAll('.service-img img, .work-img img, .qr-service-img img');
            serviceImages.forEach(img => {
                if (img.complete) {
                    img.classList.add('loaded');
                }
            });
        });