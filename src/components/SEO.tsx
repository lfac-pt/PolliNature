

interface SEOProps {
    title?: string;
    description?: string;
    canonical?: string;
    type?: 'website' | 'article';
    image?: string;
}

const SEO = ({
    title = 'Poll&Nature',
    description = 'Uma iniciativa para fortalecer a rede urbana de espaços amigos dos polinizadores em Coimbra, inspirada em boas práticas internacionais de planeamento para polinizadores e desenvolvida pelo Centre for Functional Ecology da Universidade de Coimbra e Borboletas de Coimbra no âmbito do projeto BeeConnected SUDOE.',
    canonical = 'https://pollinature.pt',
    type = 'website',
    image = 'https://pollinature.pt/logos/borboletas_de_coimbra_logo.webp'
}: SEOProps) => {
    const fullTitle = title === 'Poll&Nature' ? title : `${title} | Poll&Nature`;

    return (
        <>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {canonical && <link rel="canonical" href={canonical} />}

            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={canonical} />
            {image && <meta property="og:image" content={image} />}

            <meta name="twitter:creator" content="@flowerlab" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            {image && <meta name="twitter:image" content={image} />}
        </>
    );
}

export default SEO;
