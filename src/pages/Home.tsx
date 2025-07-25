import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ExternalLink } from "lucide-react";

const newsItems = [
  {
    id: 1,
    title: "Lançamento de Nova Funcionalidade de CRM",
    description: "Sistema agora conta com análise avançada de vendas e relatórios personalizados para melhor gestão de clientes.",
    category: "Produto",
    time: "2 horas atrás",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop&crop=center"
  },
  {
    id: 2,
    title: "Atualização de Segurança Implementada",
    description: "Nova camada de proteção de dados implementada com criptografia avançada e autenticação de dois fatores.",
    category: "Segurança",
    time: "5 horas atrás",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=200&fit=crop&crop=center"
  },
  {
    id: 3,
    title: "Integração com Novas Plataformas",
    description: "Agora é possível integrar o sistema com mais de 50 plataformas diferentes, incluindo redes sociais e e-commerce.",
    category: "Integração",
    time: "1 dia atrás",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop&crop=center"
  },
  {
    id: 4,
    title: "Relatório de Performance Q4",
    description: "Crescimento de 35% no último trimestre com mais de 10.000 novos usuários ativos na plataforma.",
    category: "Negócios",
    time: "2 dias atrás",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop&crop=center"
  }
];

const featuredImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop&crop=center",
    alt: "Dashboard Analytics"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop&crop=center",
    alt: "Team Collaboration"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop&crop=center",
    alt: "Business Growth"
  }
];

const Home = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Início</h1>
          <p className="text-muted-foreground">
            Últimas notícias e atualizações da plataforma
          </p>
        </div>
      </div>

      {/* Featured Images Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {featuredImages.map((image) => (
          <div key={image.id} className="relative overflow-hidden rounded-lg group">
            <img 
              src={image.url} 
              alt={image.alt}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <p className="font-medium">{image.alt}</p>
            </div>
          </div>
        ))}
      </div>

      {/* News Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Últimas Notícias</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {newsItems.map((news) => (
            <Card key={news.id} className="group hover:shadow-lg transition-shadow duration-300">
              <div className="relative overflow-hidden rounded-t-lg">
                <img 
                  src={news.image} 
                  alt={news.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <Badge className="absolute top-3 left-3" variant="secondary">
                  {news.category}
                </Badge>
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Clock className="h-4 w-4" />
                  <span>{news.time}</span>
                </div>
                <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                  {news.title}
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {news.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <button className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
                  Ler mais
                  <ExternalLink className="h-4 w-4" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Home;