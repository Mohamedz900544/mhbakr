
import { Doctor, Specialty, Product, BlogPost, ForumTopic, Pet, Appointment, AdoptionPet } from './types';

export const CITIES = [
  'القاهرة',
  'الجيزة',
  'الإسكندرية',
  'المنصورة',
  'طنطا',
  'شرم الشيخ',
  'الغردقة',
  'أسوان'
];

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: '1',
    name: 'د. محمد يحيى',
    title: 'استشاري جراحة العظام',
    specialty: Specialty.SURGERY,
    bio: 'خبرة 15 عاماً في جراحات العظام المعقدة وتثبيت الكسور. حاصل على الزمالة البريطانية.',
    about: 'عيادة متخصصة مجهزة بأحدث أجهزة الأشعة الرقمية (X-Ray) وغرف عمليات معقمة بنظام الكبسولة. نقوم بإجراء عمليات تثبيت الكسور، الرباط الصليبي، وعلاج تشوهات العظام.',
    qualifications: ['دكتوراه الجراحة العامة - جامعة القاهرة', 'عضو الجمعية العالمية للطب البيطري', 'زمالة الكلية الملكية للجراحين'],
    price: 450,
    location: 'المعادي، القاهرة',
    rating: 4.9,
    reviewsCount: 320,
    imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400',
    available: true,
    verified: true,
    waitingTime: 30,
    images: [
        'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400', 
        'https://images.unsplash.com/photo-1584820927997-41b42a24580e?auto=format&fit=crop&q=80&w=400', 
        'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=400' 
    ],
    mapPosition: { top: '65%', left: '55%' } 
  },
  {
    id: '2',
    name: 'د. سارة عبد الرحمن',
    title: 'أخصائية باطنة وقلب',
    specialty: Specialty.SMALL_ANIMALS,
    bio: 'متخصصة في تشخيص الأمراض الباطنية المزمنة ومشاكل القلب والكلى عند القطط والكلاب.',
    about: 'نقدم رعاية شاملة لمرضى القلب والكلى، مع توفر جهاز إيكو (ECHO) وسونار متطور. لدينا وحدة عناية مركزة للحالات الحرجة.',
    qualifications: ['ماجستير طب الحيوانات الأليفة', 'دبلومة السونار التشخيصي'],
    price: 300,
    location: 'مصر الجديدة، القاهرة',
    rating: 4.8,
    reviewsCount: 215,
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    available: true,
    verified: true,
    waitingTime: 15,
    images: [
        'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400',
        'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400'
    ],
    mapPosition: { top: '62%', left: '58%' } 
  },
  {
    id: '3',
    name: 'د. خالد مصطفى',
    title: 'استشاري حيوانات المزرعة',
    specialty: Specialty.LARGE_ANIMALS,
    bio: 'خبير في رعاية الماشية والخيول، برامج التحصين، والتلقيح الصناعي.',
    about: 'زيارات ميدانية للمزارع، إشراف بيطري كامل، سونار تناسلي للخيول والأبقار، وعلاج حالات المغص المعوي.',
    qualifications: ['دكتوراه أمراض تناسلية', 'استشاري مزارع'],
    price: 500,
    location: 'المنصورة، الدقهلية',
    rating: 4.7,
    reviewsCount: 150,
    imageUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
    available: false,
    verified: true,
    waitingTime: 60,
    images: ['https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&q=80&w=400'],
    mapPosition: { top: '30%', left: '60%' } 
  },
  {
    id: '4',
    name: 'د. نهى سليم',
    title: 'أخصائية حيوانات نادرة',
    specialty: Specialty.EXOTIC,
    bio: 'الوحيدة المتخصصة في علاج السلاحف، الببغاوات، الهامستر، والزواحف في المنطقة.',
    about: 'علاج مشاكل المنقار والريش للببغاوات، جراحات السلاحف، وعلاج الطفيليات للزواحف.',
    price: 250,
    location: 'الشيخ زايد، الجيزة',
    rating: 4.9,
    reviewsCount: 180,
    imageUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=400',
    available: true,
    verified: true,
    waitingTime: 20,
    images: ['https://images.unsplash.com/photo-1452857297128-d9c29adba80b?auto=format&fit=crop&q=80&w=400'],
    mapPosition: { top: '60%', left: '48%' } 
  },
  {
    id: '5',
    name: 'د. عمر الفاروق',
    title: 'طبيب طوارئ وعناية مركزة',
    specialty: Specialty.SMALL_ANIMALS,
    bio: 'خدمة 24 ساعة للحالات الحرجة، حالات التسمم، والحوادث.',
    about: 'مركز طوارئ متكامل يعمل 24 ساعة. مجهز بأجهزة تنفس صناعي، نقل دم، ومضادات السموم.',
    price: 350,
    location: 'وسط البلد، القاهرة',
    rating: 4.6,
    reviewsCount: 400,
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
    available: true,
    verified: true,
    waitingTime: 0,
    mapPosition: { top: '63%', left: '53%' } 
  },
  {
    id: '6',
    name: 'د. ياسمين عادل',
    title: 'أخصائية أسنان بيطرية',
    specialty: Specialty.DENTAL,
    bio: 'تنظيف الجير بأحدث أجهزة الموجات فوق الصوتية، حشو وخلع الأسنان.',
    about: 'ابتسامة أليفك مسؤوليتنا. نعالج التهابات اللثة، ونقوم بخلع الأسنان اللبنية المحتبسة.',
    price: 400,
    location: 'التجمع الخامس، القاهرة',
    rating: 5.0,
    reviewsCount: 90,
    imageUrl: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=400',
    available: true,
    verified: true,
    waitingTime: 45,
    mapPosition: { top: '66%', left: '60%' }
  },
  {
    id: '7',
    name: 'د. أحمد كمال',
    title: 'أخصائي طيور زينة',
    specialty: Specialty.POULTRY,
    bio: 'متخصص في أمراض البادجي والكوكاتيل والطيور المهاجرة.',
    about: 'عيادة متخصصة في الطيور. إجراء تحاليل الـ DNA لتحديد الجنس، وقص الأظافر والمنقار باحترافية.',
    price: 200,
    location: 'مدينة نصر، القاهرة',
    rating: 4.5,
    reviewsCount: 150,
    imageUrl: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&q=80&w=400',
    available: true,
    verified: true,
    waitingTime: 30,
    mapPosition: { top: '64%', left: '57%' }
  }
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt_1',
    doctorId: '1',
    doctorName: 'د. محمد يحيى',
    doctorSpecialty: 'جراحة عظام',
    date: '2024-10-25',
    time: '04:00 م',
    status: 'upcoming',
    petName: 'بندق',
    location: 'المعادي، القاهرة',
    price: 450
  },
  {
    id: 'apt_2',
    doctorId: '2',
    doctorName: 'د. سارة عبد الرحمن',
    doctorSpecialty: 'باطنة',
    date: '2024-10-20',
    time: '02:30 م',
    status: 'completed',
    petName: 'بندق',
    location: 'مصر الجديدة، القاهرة',
    price: 300
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'رويال كانين للقطط (Sterilised)',
    category: 'طعام',
    price: 850,
    oldPrice: 950,
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=300',
    rating: 4.8,
    badge: 'الأكثر مبيعاً'
  },
  {
    id: '2',
    name: 'دراي فود ميرا (Dog)',
    category: 'طعام',
    price: 1200,
    image: 'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&q=80&w=300',
    rating: 4.6
  },
  {
    id: '3',
    name: 'رمل قطط (Carbon)',
    category: 'عناية',
    price: 150,
    image: 'https://images.unsplash.com/photo-1615818449063-69b7a3a910a6?auto=format&fit=crop&q=80&w=300',
    rating: 4.5
  },
  {
    id: '4',
    name: 'شامبو مضاد للفطريات',
    category: 'عناية',
    price: 120,
    oldPrice: 150,
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=300',
    rating: 4.7
  },
  {
    id: '5',
    name: 'بوكس تنقل (Carrier)',
    category: 'اكسسوارات',
    price: 450,
    image: 'https://images.unsplash.com/photo-1591946614720-90a587da4a36?auto=format&fit=crop&q=80&w=300',
    rating: 4.9
  },
  {
    id: '6',
    name: 'لعبة كرة ذكية',
    category: 'اكسسوارات',
    price: 200,
    image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&q=80&w=300',
    rating: 4.4,
    badge: 'جديد'
  },
  {
    id: '7',
    name: 'فيتامينات متعددة',
    category: 'أدوية',
    price: 300,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=300',
    rating: 4.8
  },
  {
    id: '8',
    name: 'اشتراك شهري (بوكس السعادة)',
    category: 'اشتراكات',
    price: 1500,
    oldPrice: 1800,
    image: 'https://images.unsplash.com/photo-1610337673044-69c3113ac182?auto=format&fit=crop&q=80&w=300',
    rating: 5.0,
    badge: 'عرض خاص'
  }
];

export const MOCK_BLOGS: BlogPost[] = [
    {
        id: '1',
        title: 'كيف تحمي حيوانك من ضربة الشمس؟',
        category: 'نصائح طبية',
        image: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&q=80&w=400',
        summary: 'مع ارتفاع درجات الحرارة، يتعرض الكلاب والقطط لخطر الاحتباس الحراري. تعرف على الأعراض وطرق الوقاية.',
        date: '2024-10-25',
        author: 'محمد يحيى',
        content: '<p>المحتوى الكامل للمقال هنا...</p>'
    },
    {
        id: '2',
        title: 'أفضل نظام غذائي للقطط المعقمة',
        category: 'تغذية',
        image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400',
        summary: 'القطط المعقمة تحتاج لنظام غذائي خاص لتجنب السمنة وحصوات الكلى. إليك أهم النصائح.',
        date: '2024-10-20',
        author: 'سارة عبد الرحمن',
        content: '<p>المحتوى الكامل للمقال هنا...</p>'
    },
    {
        id: '3',
        title: '5 علامات تدل على أن كلبك سعيد',
        category: 'سلوك',
        image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80&w=400',
        summary: 'لغة الجسد عند الكلاب تخبرنا الكثير. كيف تعرف أن صديقك الوفي يشعر بالسعادة والراحة؟',
        date: '2024-10-18',
        author: 'نهى سليم',
        content: '<p>المحتوى الكامل للمقال هنا...</p>'
    }
];

export const MOCK_FORUM: ForumTopic[] = [
    {
        id: '1',
        title: 'قطتي بترجع شعر كتير، ايه الحل؟',
        author: 'أحمد علي',
        authorRole: 'client',
        replies: 15,
        views: 340,
        tag: 'استفسارات',
        lastActive: 'منذ 5 دقائق',
        content: 'يا جماعة عندي مشكلة كرات الشعر...'
    },
    {
        id: '2',
        title: 'تجربتي مع دكتور محمد يحيى (عملية كسر)',
        author: 'منى زكي',
        authorRole: 'client',
        replies: 42,
        views: 1200,
        tag: 'قصص نجاح',
        lastActive: 'منذ ساعة',
        content: 'حبيت اشكر الدكتور محمد...'
    },
    {
        id: '3',
        title: 'جدول تطعيمات الكلاب (محدث 2024)',
        author: 'د. سارة',
        authorRole: 'doctor',
        replies: 8,
        views: 560,
        tag: 'نصائح طبية',
        lastActive: 'منذ يوم',
        content: 'ده الجدول الرسمي للتطعيمات...'
    }
];

export const MOCK_ADOPTION: AdoptionPet[] = [
    {
        id: '1',
        name: 'لوزة',
        type: 'قط',
        breed: 'بلدي',
        gender: 'female',
        age: '6 شهور',
        location: 'المعادي',
        image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400',
        story: 'لوزة قطة هادية جداً، تم إنقاذها من الشارع. مطعمة ومعقمة وتستخدم الليتر بوكس.',
        vaccinated: true,
        ownerName: 'جمعية الرفق',
        status: 'available'
    },
    {
        id: '2',
        name: 'ماكس',
        type: 'كلب',
        breed: 'جولدن ميكس',
        gender: 'male',
        age: 'سنة',
        location: 'الرحاب',
        image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400',
        story: 'ماكس بيحب اللعب جداً ومعتاد على الأطفال. يحتاج بيت فيه مساحة للحركة.',
        vaccinated: true,
        ownerName: 'كريم عادل',
        status: 'available'
    },
    {
        id: '3',
        name: 'بسبوسة',
        type: 'قط',
        breed: 'شيرازي',
        gender: 'female',
        age: 'سنتين',
        location: 'مدينة نصر',
        image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&q=80&w=400',
        story: 'صاحبتها سافرت ومش قادرة تاخدها. هادية جداً وبتحب النوم.',
        vaccinated: false,
        ownerName: 'ندى أحمد',
        status: 'available'
    }
];

export const MOCK_PETS: Pet[] = [
    {
        id: 'pet_1',
        name: 'بندق',
        type: 'قط',
        breed: 'شيرازي',
        age: 'سنتين',
        weight: '4 كجم',
        image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=300',
        lastCheckup: '2024-09-15',
        nextVaccine: '2024-12-01',
        nextVaccineName: 'التطعيم الرباعي',
        medicalHistory: [
            { date: '2024-09-15', diagnosis: 'فحص دوري', doctor: 'د. سارة' },
            { date: '2024-05-10', diagnosis: 'نزلة معوية', doctor: 'د. محمد' }
        ]
    }
];
