import homeG1 from "./../../img/images/homeG1.png";
import homeG2 from "./../../img/images/homeG2.png";
import homeG3 from "./../../img/images/homeG3.png";

const Gallerycon = () => {
    const imageUrls = [
        homeG1,
        homeG2,
        homeG3,
        "https://avatars.dzeninfra.ru/get-zen_doc/271828/pub_66cad3984f46f76bfdf8becb_66cad3c8616dc7420da71a09/scale_1200",
        "https://avatars.dzeninfra.ru/get-zen_doc/271828/pub_66cad3984f46f76bfdf8becb_66cad3ff24e5a96c7504b5d4/scale_1200",
        "https://avatars.dzeninfra.ru/get-zen_doc/271828/pub_66cad3984f46f76bfdf8becb_66cad4322469f14d365cde80/scale_1200",
        "https://avatars.dzeninfra.ru/get-zen_doc/271828/pub_66cad3984f46f76bfdf8becb_66cad44f967ab25e73365ec8/scale_1200",
        "https://avatars.dzeninfra.ru/get-zen_doc/271828/pub_66cad3984f46f76bfdf8becb_66cad475e9ef1446992062c3/scale_1200",
        "https://avatars.dzeninfra.ru/get-zen_doc/271828/pub_66cad3984f46f76bfdf8becb_66cad4e5523ee35df32f61a2/scale_1200",
        "https://avatars.dzeninfra.ru/get-zen_doc/271828/pub_66cad3984f46f76bfdf8becb_66cad54e2bcfe47052256bfd/scale_1200",
        "https://avatars.dzeninfra.ru/get-zen_doc/271828/pub_66b076dc8ffd6379ec84794b_66b09ca6596cc8525e73fa3d/scale_1200",
        "https://mechtaevo.ru/assets/components/phpthumbof/cache/01.10.2025-1.7062b411bd9dd42a8dc5ad9e860b6f8f.webp",
        "https://mechtaevo.ru/assets/components/phpthumbof/cache/dji-0633.7062b411bd9dd42a8dc5ad9e860b6f8f.webp",
        "https://mechtaevo.ru/assets/components/phpthumbof/cache/dom-v-otdelke-texnonikol-min.af4354ff8c0aecf896f9194269e6e1fd.webp",
        "https://mechtaevo.ru/assets/components/phpthumbof/cache/dji-0035-min.c5f3e1caa406223b376db9b05c772b0b.webp",
        "https://mechtaevo.ru/assets/components/phpthumbof/cache/dom-.b6d0d6c38e96cc500eaf3ed57dcd5c65.webp",
        "https://mechtaevo.ru/assets/components/phpthumbof/cache/dji-0656.b6d0d6c38e96cc500eaf3ed57dcd5c65.webp",
        "https://mechtaevo.ru/assets/components/phpthumbof/cache/dji-0085.b6d0d6c38e96cc500eaf3ed57dcd5c65.webp",
        "https://mechtaevo.ru/assets/components/phpthumbof/cache/dji-0813.b6d0d6c38e96cc500eaf3ed57dcd5c65.webp",
        "https://mechtaevo.ru/assets/components/phpthumbof/cache/yutub-2.b6d0d6c38e96cc500eaf3ed57dcd5c65.webp",
        "https://mechtaevo.ru/assets/components/phpthumbof/cache/dji-0794.00-01-15-05.still002.b6d0d6c38e96cc500eaf3ed57dcd5c65.webp",
        "https://mechtaevo.ru/assets/components/phpthumbof/cache/dji-0688.b6d0d6c38e96cc500eaf3ed57dcd5c65.webp",
        "https://mechtaevo.ru/assets/components/phpthumbof/cache/2-0100.8652aeb7dde69f508ccc30a2939342e5.webp",
        "https://mechtaevo.ru/assets/components/phpthumbof/cache/volodin-karkas-brus.b6d0d6c38e96cc500eaf3ed57dcd5c65.webp",
        "https://mechtaevo.ru/assets/components/phpthumbof/cache/vidos3.b6d0d6c38e96cc500eaf3ed57dcd5c65.webp",
        "https://mechtaevo.ru/assets/userfiles/default/moddocument/4455/03082b9cb8578d31e77d490518e188e8708555e6.jpeg",
        "https://mechtaevo.ru/assets/userfiles/default/moddocument/4436/b62b0fee19e856d1b9edda3bd00533fb66720b7a.jpg",
        "https://mechtaevo.ru/assets/userfiles/default/moddocument/4467/db85bef771d09660bdf4431bd6bdf2cfe9fa7d97.jpg",
        "https://mechtaevo.ru/assets/userfiles/default/moddocument/4367/bc3aaf3ea90251d55234a19bbd431788ea499d61.png",
        "https://mechtaevo.ru/assets/userfiles/default/moddocument/4454/8828f72b88e3b3b2e95d76c6b7b8b3acc1feaab0.jpg",
        "https://mechtaevo.ru/assets/userfiles/default/moddocument/4464/dc8051e63a36ec916b3cb4b09e9723caccfdb88f.jpg",
        "https://mechtaevo.ru/assets/userfiles/default/moddocument/4538/a749743dbbade12a1e56992eb0c030f58fb4482c.jpg",
        "https://mechtaevo.ru/assets/userfiles/default/moddocument/4524/b08b53b64def289074103873e05a903a4b655042.jpg",
        "https://mechtaevo.ru/assets/userfiles/default/moddocument/4539/81590c1b2e7db2f36c647ac626df7af0f7d5806a.jpg",
        "https://mechtaevo.ru/assets/userfiles/default/moddocument/4537/55e00740f3fd92a3d58127ab686fb3310c75555d.jpg",
        "https://mechtaevo.ru/assets/userfiles/default/moddocument/4527/5452dcbe8bb44b28cb7774e69dbe6c3c3fba9b43.jpg",
        "https://mechtaevo.ru/assets/userfiles/default/moddocument/4457/d7dc5a53e6757379c9ff6b48e9b3e84117fa53e5.jpg",
        "https://mechtaevo.ru/assets/userfiles/default/moddocument/4434/d5d03e59cc81cd6e6091eb25fc2ef91d869be567.jpg",
        "https://mechtaevo.ru/assets/userfiles/default/moddocument/4433/2ebb45e3f80882fbe73879e3602405299bb2990c.jpg",
        "https://mechtaevo.ru/assets/userfiles/default/moddocument/4499/6799f1b2de87b984c378480ccb2c1c449cf19b13.jpg",
        "https://mechtaevo.ru/assets/userfiles/default/moddocument/4488/c44ce392375938603164d6f89aa78a605be8084f.jpg",
        "https://mechtaevo.ru/assets/userfiles/default/moddocument/4430/8c9a612e51652642efe506dd756eee2f1f66b9cf.png",
        "https://mechtaevo.ru/assets/userfiles/default/moddocument/4456/eb55e47d9f469f26d7388534cdb64333cf7213ed.jpg",
        "https://mechtaevo.ru/assets/userfiles/default/moddocument/4502/2a484d1983b371a8d14b8db5f4fc68e4ae17e889.jpg",
        "https://mechtaevo.ru/assets/userfiles/default/moddocument/4526/3ae3ec16f36f01d97843af0994bff47c934b95bf.jpg",
        "https://mechtaevo.ru/assets/userfiles/default/moddocument/4432/83fd0a76fca8e270f387e606334d1a0414f9e137.jpg",
        "https://mechtaevo.ru/assets/userfiles/default/moddocument/4501/2c8a9bbee9e4b69de7b5c6f9d1f6c506008e0aa5.jpg",
        "https://mechtaevo.ru/assets/userfiles/default/moddocument/4525/6f584bbf444358953cc0ecf37f0bd07477c5dbd9.jpg",
        "https://mechtaevo.ru/assets/userfiles/default/moddocument/4500/43ae890f17a58bf8936b1f0a568d22beeff2e0ba.jpg",
        "https://mechtaevo.ru/assets/userfiles/default/moddocument/4437/c832c3f58496e8c837ff135f8f4e8efac317d078.jpg",
        "https://mechtaevo.ru/assets/userfiles/default/moddocument/4459/bf90d91d1da5b5a5f0aeebddb9d5a04cd8635ef0.jpg",
        "https://mechtaevo.ru/assets/userfiles/default/moddocument/4510/01306adf2bc5154d0522d58386d3c7def0825633.jpg",
        "https://mechtaevo.ru/assets/userfiles/default/moddocument/4354/ec092518b9f46bc422e6473c7203da921cf00c9f.jpg",
        "https://mechtaevo.ru/assets/userfiles/default/moddocument/4521/e6953d27a66ac66c4cad75068ec22bd66ccdd8c8.jpg"
    ];

    return (
        <main className="gallery-main">
            <h2 className="gallery-title">ГАЛЕРЕЯ</h2>
            <div className="gallery-wrapper">
                <div className="gallery-container">
                    {imageUrls.map((url, index) => (
                        <img src={url} alt={`Изображение ${index + 1}`} key={index} />
                    ))}
                </div>
            </div>
        </main>
    );
};

export default Gallerycon;