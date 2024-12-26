# B/S 体系软件设计实验报告

## 写在前面

由于在期中时只完成了前端的大致设计和 API 的设计，因此当初提交的设计文档只展示了大致的设计效果和主要技术路线，并没有详细的架构设计细节和具体代码实现，略显粗糙。同时在后续开发过程中，我也发现了一些设计上的问题，对 API 和前端设计进行了一些调整。因此在这次实验报告中，我将对之前的设计文档进行一些修改，同时对后端和爬虫的设计进行详细的描述。

## 总述

### 项目背景与介绍

随着电子商务的快速发展，各种电商平台层出不穷，同一个商品在不同的平台上价格差异很大，用户往往需要在多个平台上比价才能找到最优惠的商品。本项目旨在为用户提供一个商品比价的工具，用户可以通过输入商品名称，获取该商品在不同电商平台上的价格信息，从而帮助用户快速找到最优惠的商品。

本项目名为 “寻惠” (DisFinder)，旨在帮助用户找到最优惠的商品。由于国内平台对爬虫的限制较多，因此本项目主要针对国外电商平台，如亚马逊、eBay 等。

### 项目需求

本项目主要实现以下功能：

1. 用户输入商品名称，系统在不同电商平台上搜索该商品，并返回价格信息。
2. 用户可以将商品添加到心愿单，系统会定时推送商品价格变动信息。
3. 用户可以查看每一个商品的历史价格走势。
4. 用户进行基本的用户管理操作，如注册、登录、修改密码、修改个人信息等。
5. 实现响应式设计，支持移动端访问。

### 项目架构设计与技术栈

#### 需求实现思路

对于本项目提出的各项需求，我们可以将其大致分为前端、后端、数据库和爬虫四个部分，通过各部分的协作来实现整个项目。

1. 用户查询商品：用户在前端输入商品名称，前端将商品名称传递给后端，后端通过爬虫模块从各电商平台上获取商品价格信息，将数据保存到数据库中，然后将数据返回给前端。
2. 用户关注商品：用户在前端将商品添加到心愿单，后端将商品信息存储到数据库中，定时任务模块会定时检查商品价格变动情况，如果价格发生变动，会向用户发送邮件推送消息，同时将价格变动信息存储到数据库中。
3. 用户管理：用户在前端界面进行用户管理操作，然后前端将请求发送给后端，后端对数据库进行相应的操作。
4. 响应式设计：前端需要适配不同的设备，因此需要实现响应式设计。

#### 架构设计

![总体架构示意图](assets/report/architecture.png)

项目的总体架构如图所示，主要分为前端、后端、数据库和爬虫四个部分。

- 前端：负责用户交互，用户输入商品名称、查看商品价格信息、添加商品到心愿单、查看历史价格走势等操作。它通过 API 与后端进行通信。
- 后端：负责处理前端的请求，调用爬虫模块获取商品价格信息，将数据存储到数据库中，同时处理用户管理操作。它通过 API 与前端进行通信，通过 ORM 与数据库进行交互，通过 API 与爬虫模块进行通信。
- 数据库：存储用户信息、商品信息、价格信息等数据。
- 爬虫：负责接受后端的请求，从各电商平台上获取商品价格信息，将数据返回给后端。

通过这样的架构设计，我们实现了前后端分离的 B/S 体系结构，同时将爬虫模块独立出来，方便后续的扩展和维护。

#### 技术栈

##### 前端

- 基于 Node.js 进行开发，Node.js 广泛应用于前端开发。
- 使用 Next.js 框架进行开发，Next.js 是一个 React 框架，提供了响应式渲染、静态导出等功能。
- 使用 NextUI 组件库进行开发，NextUI 是一个基于 React 的组件库，提供了丰富的组件，能够快速搭建前端界面，同时保证了界面的一致性。

##### 后端

- 基于 Go 进行开发，Go 广泛应用于后端开发中，具有高效、简洁、易用等特点，同时有丰富的第三方库能够支持网络编程、数据库操作等功能。
- 使用 Gin 框架进行开发，Gin 是一个轻量级的 Web 框架，提供了路由、中间件、参数绑定等功能，能够解析后端请求并通过中间件等功能进行鉴权处理。
- 使用 GORM 进行数据库操作，GORM 是一个 Go 语言的 ORM 库，提供了对数据库的增删改查等操作，支持多种数据库，如 MySQL、PostgreSQL、SQLite 等。
- 使用 Viper 进行配置管理，Viper 是一个 Go 语言的配置管理库，支持多种配置格式，如 JSON、YAML、TOML 等。

##### 数据库

- 使用 MySQL 作为数据库，MySQL 是一个开源的关系型数据库，具有高性能、高可靠性等特点，广泛应用于各种应用场景。它易于部署，同时受 GORM 支持，能够方便地进行数据库操作。

##### 爬虫

- 使用 Python 进行开发，具有丰富的第三方库支持，能够方便地进行网络爬虫开发。
- 使用 BeautifulSoup 进行 HTML 解析，从而获取商品价格信息。
- 使用 Flask 框架进行开发，Flask 是一个轻量级的 Web 框架，用于向后端提供爬虫服务。

## API 设计

在模块化的架构设计中，如何保证各模块间的统一通信是一个重要的问题。为此，我们设计了一套统一的 API 接口，用于前后端和爬虫模块之间的通信。

我们使用 Apifox 工具进行 API 设计，详细的 API 设计文档可以查看 [Apifox 接口文档](https://apifox.com/apidoc/project-5427055/)

##### 用户信息接口

这一系列接口主要用于用户管理，包括用户注册、用户登录、修改密码、用户信息查询、用户信息修改、登出等操作。

- `UserGetInfo`: 用户信息查询，通过用户 ID 查询用户信息。可以在用户信息页面中使用。此处直接通过鉴权中间件获取用户信息，不需要额外的参数。
- `UserUpdateInfo`: 用户信息修改，通过用户 ID 修改用户信息。可以在用户信息页面中使用。需要传递用户 ID 和修改后的用户信息。
- `UserRegister`: 用户注册，需要传递用户名、密码、邮箱信息。
- `UserLogin`: 用户登录，需要传递用户名和密码信息。
- `UserLogout`: 用户登出，不需要传递参数。
- `UserUpdatePassword`: 修改密码，需要传递用户 ID 、原密码和新密码，后端会对原密码进行验证。

##### 电商平台接口

这一系列接口主要用于电商平台管理，包括获取所有电商平台信息、获取单个电商平台信息等操作。

- `PlatformGetName`: 获取指定 ID 的电商平台名称，需要传递电商平台 ID。
- `PlatformGetList`: 获取所有电商平台信息，不需要传递参数。

##### 心愿单接口

这一系列接口主要用于用户心愿单管理，包括查询心愿单、添加商品到心愿单、从心愿单中删除商品等操作。由于心愿单是用户私有的，因此需要鉴权。

- `WishlistGet`: 查询心愿单，此处进行分页，需要传递页码和每页数量。
- `WishlistAdd`: 添加商品到心愿单，需要传递商品 ID。
- `WishlistDelete`: 从心愿单中删除商品，需要传递商品 ID。
- `WishlistClear`: 清空心愿单，不需要传递参数。

##### 商品接口

这一系列接口主要用于商品管理，包括查询商品信息、查询商品历史价格信息、批量获取商品等操作。

- `ProductSearch`: 向后端发起商品搜索请求，需要传递关键词。这个请求会让后端调用爬虫模块进行搜索，没有直接返回结果。
- `ProductGetList`: 获取指定关键词的商品列表，需要传递关键词、页码和每页数量。
- `ProductGetInfo`: 获取指定商品的详细信息，需要传递商品 ID。
- `ProductGetPriceHistory`: 获取指定商品的历史价格信息，需要传递商品 ID 和限定的时间范围。

从这里可以看到，商品的搜索分为两步，一是调用 `ProductSearch` 接口进行搜索，二是调用 `ProductGetList` 接口获取搜索结果。这样的设计可以让搜索逻辑更加清晰，同时也方便实现搜索结果的分页。

##### 爬虫接口

这一系列接口主要用于后端向爬虫模块发起请求，获取商品价格信息。

- `ScraperSearch`: 向爬虫模块发起商品搜索请求，需要传递关键词。
- `ScraperPoll`: 获取指定商品的价格信息，需要传递商品 ID。

通过统一的 API 设计，我们实现了前后端和爬虫模块之间的统一通信，保证了各模块之间的协作。

## 前端设计

### 结构设计

前端基于 Next.js 进行开发，整体的项目核心代码结构如下：

```
frontend/src
├── app
│   ├── auth
│   │   └── page.tsx
│   ├── favicon.ico
│   ├── fonts
│   │   ├── GeistMonoVF.woff
│   │   └── GeistVF.woff
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── product
│   │   └── [id]
│   │       └── page.tsx
│   ├── providers.tsx
│   ├── search
│   │   └── page.tsx
│   ├── user
│   │   └── page.tsx
│   └── wishlist
│       └── page.tsx
├── components
│   ├── DarkIcon.jsx
│   ├── LightIcon.jsx
│   ├── Loading.tsx
│   ├── Logo.jsx
│   ├── Navbar.tsx
│   ├── SearchBox.tsx
│   ├── SearchIcon.jsx
│   ├── ThemeSwitcher.tsx
│   └── WishlistIcon.jsx
└── models
    ├── error.tsx
    ├── models.tsx
    ├── request.tsx
    └── response.tsx
```

- `app`: 主要包含了各个页面的代码，如用户管理、商品搜索、商品详情、心愿单等页面。
- `components`: 主要包含了一些通用的组件，如 Navbar、SearchBox、ThemeSwitcher 等。
- `models`: 主要包含了一些数据模型，如请求、响应、错误等，保证 API 的统一性。

### 页面设计

前端主要包含以下几个核心页面和组件：

1. Navbar：导航栏，包含了 Logo、视觉模式切换、心愿单入口、用户管理入口。
2. SearchBox：搜索框，用户输入商品名称，点击搜索按钮后，会跳转到商品搜索页面。
3. ProductSearch：商品搜索页面，展示搜索结果，用户可以选择商品查看详情。
4. ProductDetail：商品详情页面，展示商品的详细信息、价格信息、历史价格走势等。
5. UserCenter：用户中心页面，展示用户信息，提供修改密码、退出登录、管理电商平台账户等功能。
6. Wishlist：心愿单页面，展示用户关注的商品信息，提供取消关注、查看商品详情等功能。
7. Auth：用户登录、注册页面，提供用户登录、注册功能。

下面逐一介绍这些页面的设计。

#### Navbar

##### 设计思路

Navbar 是整个网站的核心导航栏，包含了 Logo、视觉模式切换、心愿单入口、用户管理入口等。

Logo 是网站的标志，点击 Logo 可以回到首页。此处导航使用了 Next.js 的 Router，通过 `useRouter` 和 `push` 方法实现页面跳转。同时这里我自主设计了一个 Logo，通过 SVG 图片实现。

视觉模式切换是一个按钮，用户可以通过点击按钮切换视觉模式，包括 Light 和 Dark 两种模式。这里使用了 NextUI 提供的主题切换功能，通过 `useTheme` 和 `setTheme` 方法实现主题切换。

心愿单入口是一个按钮，用户可以通过点击按钮进入心愿单页面。这里使用了 Next.js 的 Router 实现页面跳转。

用户管理入口使用 NextUI 中的 `Dropdown` 组件实现，用户可以通过点击头像打开下拉菜单，可以查看用户信息、进入用户中心和退出登录。

##### 核心组件逻辑

在 Navbar 中，最核心的页面逻辑是对用户登录状态的判断，如果用户已登录，则显示用户头像和下拉菜单，否则显示登录和注册按钮。

为此，在 Navbar 组件中，我们需要通过向后端发送请求，获取用户信息，判断用户是否已登录。这里我们使用了 Next.js 提供的 `useEffect` 钩子函数，实现了在组件加载时向后端发送请求，获取用户信息的逻辑。

```tsx
useEffect(() => {
    const fetchUser = async () => {
        const response = await fetch(`${apiUrl}/api/user/info`, {
            method: 'GET',
            credentials: 'include',
        });

        const resp: Response = await response.json();
        console.log(resp)
        if (resp.code == ErrorCode.NoErr) {
            const user_resp: UserGetInfoResp = resp.data as UserGetInfoResp;
            const user: User = {
                id: user_resp.id,
                name: user_resp.name,
                email: user_resp.email,
            }
            setUser(user);
            setIsLogin(true);
        } else if (resp.code == ErrorCode.ErrNotLogin) {
            setIsLogin(false);
        } else {
            console.error(resp.msg);
        }

    };
    fetchUser();
}, []);
```

```tsx
{isLogin ? (
<Dropdown placement="bottom-end" className="text-foreground bg-background">
    ...
</Dropdown>
) : (
<Link href="/auth">
    <Button className="bg-primary-500 text-primary-50" color="primary" variant="solid" aria-label="Login">
        Login
    </Button>
</Link>
)}
```

其中的 `apiUrl` 是后端的 API 地址，通过 `.env` 文件配置。通过向 `/api/user/info` 发送 GET 请求，获取用户信息，根据返回的状态码判断用户是否已登录。然后根据用户登录状态，显示不同的内容。

在向后端请求的过程中，我们始终使用 models 中定义的请求和响应模型，保证了 API 的统一性。

同时此处需要注意的是，我们使用了 `credentials: 'include'` 选项，保证了在跨域请求时能够携带 Cookie，从而实现了用户登录状态的保持。

#### SearchBox

// TODO: SearchBox 图片

##### 设计思路

SearchBox 是一个搜索框，用户可以在搜索框中输入商品名称，然后点击搜索按钮进行搜索。搜索框的设计主要包括输入框和搜索按钮两部分。

输入框是一个文本输入框，用户可以在输入框中输入商品名称。这里使用了 NextUI 提供的 `Input` 组件，通过 `onChange` 属性实现输入框的绑定。

搜索按钮是一个按钮，用户可以通过点击按钮进行搜索。这里使用了 NextUI 提供的 `Button` 组件，通过 `onClick` 属性实现按钮的点击事件。同时为了指示用户在搜索时正在加载，我们使用了 NextUI 提供的 `Spinner` 组件，实现了搜索时的加载动画。

##### 核心组件逻辑

SearchBox 组件的核心逻辑是搜索功能的实现。用户在输入框中输入商品名称，然后点击搜索按钮，SearchBox 组件会将商品名称传递给后端，后端调用爬虫模块进行搜索，当搜索完成后通知前端，前端跳转到商品搜索页面。

```tsx
    const fetchSearch = async () => {
        const response = await fetch(`${apiUrl}/api/product/search?keyword=${query}`, {
            method: 'POST',
            credentials: 'include',
        });
        if (!response.ok) {
            console.error('Failed to search');
            setIsLoading(false);
            return;
        }

        const resp: Response = await response.json();
        console.log(resp)
        if (resp.code == ErrorCode.NoErr) {
            router.replace(`/search?keyword=${query}`);
        } else {
            console.error(resp.msg);
        }
        setIsLoading(false);
    };
```

这里我们跳转到商品搜索界面时，对商品搜索界面的路径采用 query 参数的形式，这样可以保证用户在搜索后刷新页面时，能够保留搜索结果。

#### ProductSearch

##### 设计思路

ProductSearch 页面是商品搜索结果展示页面，用户在搜索框中输入商品名称后，会跳转到该页面，展示搜索结果。搜索结果主要包括商品名称、商品价格、商品图片等信息。

搜索结果是一个列表，每个列表项包括商品名称、商品价格、商品图片等信息。这里使用了 NextUI 提供的 `Card` 组件，实现了列表项的展示。能够正确展示商品名称、价格、图片等信息。同时我们考虑到了商品名称过长的情况，实现了商品名称的截断显示。

每一个列表项都是一个链接，用户可以点击列表项进入商品详情页面。

同时在页面底部，我们提供了分页功能，用户可以通过点击页码进行翻页。这里使用了 NextUI 提供的 `Pagination` 组件，实现了分页功能。

##### 核心页面逻辑

ProductSearch 页面的核心逻辑是获取搜索结果，展示搜索结果，以及分页功能的实现。

在向后端发送请求前，我们需要通过 Next.js 中的 `useSearchParams` 获取 URL 中的 query 参数，从而获取用户输入的商品名称。然后向后端发送请求，获取搜索结果。(发送请求的逻辑与 SearchBox 中的逻辑类似，这里不再赘述)

```tsx
const params = useSearchParams();
const keyword = params.get('keyword');
```

然后是分页功能的实现。我们需要通过向后端发送请求，获取指定页码的搜索结果。这里我们使用了 NextUI 提供的 `Pagination` 组件，通过 `onChange` 属性实现页码的切换。

```tsx
const handlePageChange = (prev: number) => {
    setPageNum(prev);
};
// ...
<div className='mx-auto mt-8'>
    <Pagination showControls total={Math.ceil(total / page_size)} page={page_num} onChange={handlePageChange} size='lg' />
</div>
```
最后只需要在请求时传递页码参数，后端会返回指定页码的搜索结果。

#### ProductDetail

// TODO: ProductDetail 图片

##### 设计思路

ProductDetail 页面是商品详情页面，用户在搜索结果中点击商品后，会跳转到该页面，展示商品的价格信息、历史价格走势等。

商品详情主要包括商品名称、商品价格、商品图片、商品平台等信息。

商品名称、商品图片是一个卡片，展示商品的名称和图片。这里使用了 NextUI 提供的 `Card` 组件，实现了商品名称和图片的展示。

商品价格和商品平台是另一个卡片，展示商品的价格和平台信息。同时这里还增加了两个按钮，一个是跳转到商品平台的按钮，用户可以通过点击按钮跳转到商品的购买页面；另一个是添加到心愿单的按钮，用户可以通过点击按钮将商品添加到心愿单。

商品历史价格走势是一个折线图，展示商品的历史价格走势。这里使用了 `rechart` 组件，实现了历史价格走势的展示。

##### 核心页面逻辑

ProductDetail 页面的路由参数是商品 ID，我们需要通过 `useParams` 获取商品 ID，才能向后端发送请求，获取商品的详细信息。

```tsx
const params = useParams();
const id = Number(params.id);
```

在这个页面中，包含多次向后端发送的请求：

1. 获取商品的详细信息，包括商品名称、商品价格、商品图片、商品平台等信息。
2. 获取商品的历史价格走势，包括商品的历史价格信息。
3. 根据商品平台的 ID 获取商品平台的名称。
4. 添加商品到心愿单。

此处使用了 `useEffect` 钩子函数，实现了在组件加载时向后端发送请求，获取商品的详细信息和历史价格走势。由于逻辑和 SearchBox 中的逻辑类似，这里不再赘述。

需要注意的是如果添加心愿单时用户仍未登录，便会跳转到登录页面。

同时在展示商品价格走势图时，我们需要将后端返回的历史价格信息转换为 `rechart` 组件需要的数据格式。需要注意的是，后端发来的 Date 是一个 ISO 格式的字符串，我们需要将其转换为更为简洁的日期格式。

```tsx
const formatDate = (time: string) => {
    // convert ISO time string to date
    const date = new Date(time);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month}-${day}`;
}
//...
const new_data: ChartData[] = [];
data.history.forEach((item: PriceHistory) => {
    new_data.push({ name: formatDate(item.date), price: item.price });
});
setData(new_data);
```

#### UserCenter

##### 设计思路

// TODO: UserCenter 图片

UserCenter 页面是用户中心页面，用户可以在该页面查看用户信息、修改密码、退出登录等操作。

用户信息是一个卡片，展示用户的用户名、邮箱等信息。用户可以通过点击修改密码按钮，进入修改密码页面。

修改密码页面是一个表单，用户可以在表单中输入原密码和新密码，然后点击提交按钮进行修改密码。

同时我们还提供了修改用户名的功能，用户可以通过点击修改用户名按钮，直接在页面上修改用户名。

##### 核心页面逻辑

UserCenter 页面的核心逻辑是获取用户信息，展示用户信息，以及修改密码的实现。其中展示用户信息的逻辑与 Navbar 中的逻辑类似，这里不再赘述。

修改密码的逻辑需要注意的是，我们需要检验用户两次输入的新密码是否一致，以及密码的长度是否符合要求。

```tsx
const handleSavePassword = async () => {
    if (newPassword !== confirmPassword) {
        alert('New passwords do not match. Please try again.');
        return;
    }

    if (newPassword.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
    }
    // send request to backend
}
```

同时在修改用户名时，我们也需要注意用户名是否为空。

```tsx
const handleSaveUsername = async () => {
    if (newUsername.trim() === '') {
        alert('Username cannot be empty.');
        return;
    }
    // send request to backend
}
```

#### Wishlist

##### 设计思路

// TODO: Wishlist 图片

Wishlist 页面是心愿单页面，用户可以在该页面查看用户关注的商品信息、取消关注商品等操作。

心愿单是一个列表，每个列表项包括商品名称、商品价格、商品图片等信息。用户可以通过点击列表项进入商品详情页面。同时每一个列表项还包括一个取消关注按钮，用户可以通过点击按钮取消关注商品。

同时我们还提供了清空心愿单的功能，用户可以通过点击清空按钮，清空心愿单。

##### 核心页面逻辑

Wishlist 页面的核心逻辑是获取心愿单信息，展示心愿单信息，以及取消关注商品的实现，分别对应了以下几个请求：

1. 获取心愿单信息，包括商品名称、商品价格、商品图片等信息。
2. 取消关注商品，用户点击取消关注按钮后，向后端发送请求，取消关注商品。
3. 清空心愿单，用户点击清空按钮后，向后端发送请求，清空心愿单。

这里的逻辑与 ProductSearch 中的逻辑类似，这里不再赘述。

需要注意的是，当请求返回后得知用户未登录时，我们需要跳转到登录页面，这里使用了 Next.js 提供的 `useRouter` 实现页面跳转，亦不再赘述。

#### Auth

##### 设计思路

Auth 页面是用户登录、注册页面，用户可以在该页面输入用户名、密码、邮箱等信息，进行登录、注册操作。

登录表单包括用户名、密码两个输入框，用户可以在输入框中输入用户名和密码，然后点击登录按钮进行登录。

注册表单包括用户名、密码、邮箱三个输入框，用户可以在输入框中输入用户名、密码和邮箱，然后点击注册按钮进行注册。

这里使用 NextUI 提供的 `Tab` 组件，实现了登录和注册两个 Tab 页的切换。

##### 核心页面逻辑

Auth 页面的核心逻辑是用户登录、注册的实现。

在登录时，我们需要向后端发送请求，验证用户名和密码是否正确。在注册时，我们需要向后端发送请求，注册新用户。这里的逻辑与 SearchBox 中的逻辑类似，这里不再赘述。

需要注意的是，在提交表单前，我们需要对用户输入的用户名、密码、邮箱等信息进行验证，保证其合法性。

```tsx
const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    // check if email and password are empty
    if (email == "") {
        alert("Email is required");
        setIsLoading(false);
        return;
    }
    if (password == "") {
        alert("Password is required");
        setIsLoading(false);
        return;
    }
    // check email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        alert("Invalid email format");
        setIsLoading(false);
        return;
    }
    // send request to backend
}
// ...
const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    // check if username, email and password are empty
    if (username == "") {
        alert("Name is required");
        setIsLoading(false);
        return;
    }
    if (email == "") {
        alert("Email is required");
        setIsLoading(false);
        return;
    }
    if (password == "") {
        alert("Password is required");
        setIsLoading(false);
        return;
    }
    if (password.length < 6) {
        alert("Password must be at least 6 characters");
        setIsLoading(false);
        return;
    }
    // check email format
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        alert("Invalid email format");
        setIsLoading(false);
        return;
    }
    // send request to backend
}
```

至此，我们完成了前端的设计，实现了用户登录、注册、商品搜索、商品详情、心愿单等功能，保证了用户的交互体验。

## 后端设计

## 爬虫设计

## 部署与测试

## 使用文档

## 感想与总结