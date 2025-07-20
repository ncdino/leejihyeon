import Image from "next/image";

const ProfileSection = () => {
  return (
    <section className="font-paperlogy max-w-4xl mx-auto px-6 py-16">
      <div className="flex flex-col lg:flex-row items-center gap-12">
        {/* 프로필 img */}
        <div className="relative group">
          <div className="w-48 h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden shadow-2xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-800 dark:to-gray-700 transition-transform duration-500 group-hover:scale-105">
            <Image
              src="/Images/profile.jpg"
              alt="Profile"
              width={224}
              height={224}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-900 animate-pulse"></div>
        </div>

        <div className="flex-1 text-center lg:text-left space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              LEE JIHYEON
            </h1>
            <h2 className="text-xl lg:text-2xl text-blue-600 dark:text-blue-400 font-bold">
              Frontend Developer
            </h2>
            <div className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
              <p>사용자 경험을 중시하는 프론트엔드 개발자입니다.</p>
              <p>
                모던 웹 기술과 클린 코드를 통해 의미 있는 필요한 서비스를
                만들어갑니다.
              </p>
            </div>
          </div>
          <div className="flex justify-center lg:justify-start gap-4 pt-4">
            <a
              href="https://github.com/ncdino"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-6 py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-full hover:bg-gray-800 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <i className="bxl bx-github text-3xl"></i>
              <span className="font-bold">GitHub</span>
            </a>
            <a
              href="mailto:your.email@gmail.com"
              className="group flex items-center gap-3 px-6 py-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <i className="bxl bx-gmail text-3xl"></i>
              <span className="font-bold">Gmail</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileSection;
