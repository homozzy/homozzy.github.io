import { getCliClient } from 'sanity/cli';

const client = getCliClient({ apiVersion: '2024-01-01' });

const posts = [
  {
    slug: 'why-reading-notes',
    title: '为什么要给读书笔记安个家',
    description: '十一年、55 本书、52 条笔记——这些思考如果只躺在微博里，会被时间埋掉。',
    pubDate: '2026-11-02T00:00:00.000Z',
    tags: ['读书', '随想'],
    body: `从 2015 年到今天，我断断续续在微博上写了一些读书笔记。

为什么？因为我是一名高中地理教师。课堂上我要求学生“把地图读成故事”，可我自己的读书笔记其实一直是散落的。

十一年来，我收在微博里的有 52 条——春秋战国、大宋繁华、契诃夫、威斯特伐利亚体系；也有心理学里那个“自卑”和“乌合”；也有刘慈欣的故事、契诃夫的六号病室。读完之后认真写下的感受，比“读过哪些书”更重要——因为感受才推得动人。

这个站点就是给这些笔记安的家。

之所以要安个家，是因为它们正在消失。微博的时间线会淹没、会删除、会上涨的流量把“旧”推到看不见的地方。我想要一个安静的架子，把书一本本摆上去，随时抽出来再读一遍。

52 条不是终点，是开始。以后大概还会继续写下去——新读到的、重新翻过的、以及那些在课堂上想到的东西。
`,
  },
  {
    slug: 'build-notes-01',
    title: '建站手记 #01：这个站是怎么长出来的',
    description: '从零到可以直接写文章的完整记录：技术栈、数据来源、踩坑。',
    pubDate: '2026-11-05T00:00:00.000Z',
    tags: ['技术', '随想'],
    body: `这个站点是 2026 年 10 月开始做的。

**背景**：读者和我的联系一直是在微博上发“今日推书”，但那里太吵了。我想要一个安静的地方，把读书笔记、课堂随笔、为数不多但写得认真的文章都沉淀下来。

**第一步：静态站点**。我用 Astro 7 做了个静态主题，内容用 Markdown 写在仓库里。线上用 GitHub Pages 托管。

**第二件事：把微博读书笔记导进来**。我写了一个脚本，从微博导出了 52 条原创笔记和 627 条微博原文，按年份归档到这个站。跳过转发和推广，只留原创。

**第三件事：能自己写**。之前改文章要让 AI 改 Astro 文件；后来换成了 Sanity CMS，写完直接发布；再后来发现手机访问 Vercel 不稳，我就把主站搬回了 GitHub Pages，并用 GitHub Actions 自动构建部署。现在用 /write 页面就能在站内直接写。

**设计**：米纸底色、砖红印章“研思”、衬线字。读起来像翻一本旧书，而不是刷一个页面。

**数据**：51 条读书笔记来自微博 @homozzy（含《稻田里的沉默》第一部），55 本书按分类整理，6 个年份，627 条微博原文。站里没有统计脚本、没有 cookie、没有第三方追踪。

以后大概还会继续长。会长什么样，我也还不知道，但它应该一直像一本书，而不是像一个仪表盘。
`,
  },
];

const existing = await client.fetch('*[_type == "blogPost"]{ slug { current } }');
const existingSlugs = new Set(existing.map(p => p.slug?.current));

for (const post of posts) {
  if (existingSlugs.has(post.slug)) {
    console.log('skip existing', post.slug);
    continue;
  }
  const doc = await client.create({
    _type: 'blogPost',
    title: post.title,
    slug: { _type: 'slug', current: post.slug },
    description: post.description,
    pubDate: post.pubDate,
    tags: post.tags,
    body: post.body,
  });
  console.log('created', doc._id, post.slug);
}
