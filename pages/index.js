import Layout from "@/components/Layout";
import styles from "../styles/blogposts.module.css";
import { listBlogsWithCategoriesAndTags } from '../actions/blog';
import Card from '../components/blog/Card';
import Head from "next/head";
import { APP_DESCRIPTION, DOMAIN, APP_NAME } from "../config";

const Index = ({ blogs }) => {

    const showAllBlogs = () => {
    return blogs && blogs.map((blog, i) => (
            <article key={i} className={styles.box}>
                <Card blog={blog} />
            </article>
        )).slice(0, 9);
    }


    const head = () => (
        <Head>
            <title >{APP_NAME}</title>
            <meta name="description" content={APP_DESCRIPTION} />
            <link rel="canonical" href={DOMAIN} />
            <meta property="og:title" content={APP_NAME} />
            <meta property="og:description" content={APP_DESCRIPTION} />
            <meta property="og:type" content="webiste" />
            <meta name="robots" content="index, follow" />
            <meta property="og:url" content={DOMAIN} />
            <meta property="og:site_name" content={DOMAIN} />
            <meta property="og:image" content={`${DOMAIN}/icon-512.png`} />
            <meta property="og:image:secure_url" content={`${DOMAIN}/icon-512.png`} />
            <meta property="og:image:type" content="image/jpg" />
        </Head>
    );

    return (
        <>
            {head()}
            <Layout>

                <div className={styles.backImg}>
                    <br /><br />
                    <br /><br />

                    <section className={styles.topsection}>
                        <h1 className={styles.heading}>Talk is cheap. Show me the code</h1>
                        <p>It's not at all important to get it right the first time. It's vitally important to get it right the last time.</p>

                        <div className={styles.resizeimg0}>📚</div>
                        <h1>The Best way to predict the future is to invent it.</h1>
                        <p>Good code is its own best documentation. As you're about to add a comment, ask yourself, How can I improve the code so that this comment isn't needed ?</p>
                    </section>

                    <section className={styles.latestposts}>
                        <h1 className={styles.latestpostheading} >📕 Latest Post 📕</h1>
                        <div className={styles.grid}>{showAllBlogs()}</div>
                        <br />
                        <br />
                    </section>
                </div>

            </Layout>
        </>
    );
}

/*
export async function getStaticProps() {
    try {
        const data = await listBlogsWithCategoriesAndTags();
        return { props: { blogs: data.blogs }};
    } catch (error) {
        console.error("Error fetching data:", error);
        return { props: { blogs: [] }, };
    }
}
*/



export async function getServerSideProps({ query, res }) {
    try {
        const data = await singleCategory(query.slug);
        if (data.error) {
            res.statusCode = 404;
            return { props: { errorCode: 404 } };
        }
        return { props: { blogs: data.blogs }};
    } catch (error) {
        console.error(error);
        return { props: { errorCode: 500 } };
    }
  }



export default Index;