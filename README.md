# Astrologer API

A Astrologer API é um serviço RESTful que fornece cálculos astrológicos extensivos, projetado para integração perfeita em projetos. Oferece um conjunto de mapas astrológicos e dados, tornando-se uma ferramenta inestimável tanto para desenvolvedores quanto para entusiastas da astrologia.

Aqui está um exemplo de mapa natal gerado usando a Astrologer API:

![Mapa de John Lennon](https://raw.githubusercontent.com/g-battaglia/kerykeion/refs/heads/master/tests/charts/svg/John%20Lennon%20-%20Dark%20Theme%20-%20Natal%20Chart.svg)


## Resumo Rápido dos Endpoints


| Endpoint                          | Método | Descrição |
|-----------------------------------|--------|-----------|
| `/api/v4/birth-chart`            | POST   | Gera um mapa natal completo como string SVG, incluindo posições planetárias e aspectos. |
| `/api/v4/synastry-chart`         | POST   | Cria um mapa de sinastria comparando dois sujeitos, exibindo suas interações e compatibilidade, junto com uma representação SVG. |
| `/api/v4/transit-chart`          | POST   | Gera um mapa de trânsitos para um sujeito, mostrando influências planetárias atuais, com representação visual SVG. |
| `/api/v4/composite-chart`        | POST   | Calcula um mapa composto para dois sujeitos usando o método do ponto médio, incluindo aspectos e representação visual SVG. |
| `/api/v4/relationship-score`     | POST   | Calcula uma pontuação de compatibilidade (0-44) usando o método Ciro Discepolo para avaliar o potencial do relacionamento. |
| `/api/v4/natal-aspects-data`     | POST   | Fornece dados detalhados do mapa natal e aspectos sem o mapa visual. |
| `/api/v4/synastry-aspects-data`  | POST   | Retorna dados relacionados à sinastria e aspectos entre dois sujeitos, sem mapa SVG. |
| `/api/v4/transit-aspects-data`   | POST   | Oferece dados de mapa de trânsitos e aspectos para um sujeito, sem representação visual SVG. |
| `/api/v4/composite-aspects-data` | POST   | Entrega dados de mapa composto e aspectos sem gerar um mapa SVG. |
| `/api/v4/birth-data`             | POST   | Retorna dados essenciais do mapa natal sem aspectos ou representação visual. |
| `/api/v4/now`                    | GET    | Recupera dados do mapa natal para o horário UTC atual, excluindo aspectos e o mapa visual. |

## Assinatura

Para acessar a Astrologer API, assine aqui:

[Assinar a Astrologer API](https://rapidapi.com/gbattaglia/api/astrologer/pricing)

## Documentação

Explore a documentação abrangente da API:

- [Documentação Swagger](https://www.kerykeion.net/astrologer-api-swagger/): Documentação interativa com informações detalhadas sobre todos os endpoints e parâmetros.

- [Documentação Redoc](https://www.kerykeion.net/astrologer-api-redoc/): Uma interface de documentação limpa e amigável para fácil referência.

- [Especificação OpenAPI](https://raw.githubusercontent.com/g-battaglia/Astrologer-API/master/openapi.json): A especificação OpenAPI completa para a Astrologer API.

## Começando

Para começar a usar a Astrologer API, inclua sua chave API nos cabeçalhos da requisição. Esta chave é essencial para autenticar suas requisições e garantir que sejam processadas corretamente.

### Exemplo de Cabeçalhos de Requisição

Certifique-se de que suas requisições API incluam os seguintes cabeçalhos:

```javascript
headers: {
    'X-RapidAPI-Host': 'astrologer.p.rapidapi.com',
    'X-RapidAPI-Key': 'SUA_CHAVE_API'
    }
```

Substitua `SUA_CHAVE_API` pela sua chave API real obtida durante o registro.


## Recursos

### Mapas

A Astrologer API fornece vários endpoints `*-chart` com opções personalizáveis:

#### Idiomas

Você pode especificar o parâmetro `language` para selecionar o idioma do seu mapa. As opções disponíveis são:

- `EN`: Inglês (padrão)
- `FR`: Francês
- `PT`: Português
- `ES`: Espanhol
- `TR`: Turco
- `RU`: Russo
- `IT`: Italiano
- `CN`: Chinês
- `DE`: Alemão
- `HI`: Hindi

Exemplo de requisição API:

```json
{
    "subject": {
        "year": 1980,
        "month": 12,
        "day": 12,
        "hour": 12,
        "minute": 12,
        "longitude": 0,
        "latitude": 51.4825766,
        "city": "London",
        "nation": "GB",
        "timezone": "Europe/London",
        "name": "John Doe",
        "zodiac_type": "tropic"
    },
    "language": "PT"
}
```

#### Temas

Personalize a aparência dos seus mapas usando o parâmetro `theme`. Os temas disponíveis são:

Temas disponíveis:

- `light`: Tema claro moderno com cores suaves

![Exemplo de Mapa John Lennon](https://raw.githubusercontent.com/g-battaglia/kerykeion/refs/heads/master/tests/charts/svg/John%20Lennon%20-%20Light%20Theme%20-%20Natal%20Chart.svg)

- `dark`: Tema escuro moderno
  
![Exemplo de Mapa John Lennon](https://raw.githubusercontent.com/g-battaglia/kerykeion/refs/heads/master/tests/charts/svg/John%20Lennon%20-%20Dark%20Theme%20-%20Natal%20Chart.svg)

- `dark-high-contrast`: Tema escuro de alto contraste

![Exemplo de Mapa John Lennon](https://raw.githubusercontent.com/g-battaglia/kerykeion/refs/heads/master/tests/charts/svg/John%20Lennon%20-%20Dark%20High%20Contrast%20Theme%20-%20Natal%20Chart.svg)

- `classic`: Tema colorido tradicional

![Exemplo de Mapa Albert Einstein](https://raw.githubusercontent.com/g-battaglia/kerykeion/refs/heads/master/tests/charts/svg/Albert%20Einstein%20-%20Natal%20Chart.svg)

Exemplo de requisição API:

```json
{
    "subject": { /* ... */ },
    "theme": "dark"
}
```


### Tipos de Zodíaco

Você pode escolher entre os zodíacos Sideral e Tropical usando o parâmetro `zodiac_type` na chave `subject` da maioria dos endpoints.

- `tropic`: Zodíaco Tropical (padrão)
- `sidereal`: Zodíaco Sideral

Se você selecionar `sidereal`, deve também especificar o parâmetro `sidereal_mode`, que oferece vários ayanamsha (modos de cálculo zodiacal):

- `FAGAN_BRADLEY`
- `LAHIRI` (padrão para astrologia védica)
- `DELUCE`
- `RAMAN`
- `USHASHASHI`
- `KRISHNAMURTI`
- `DJWHAL_KHUL`
- `YUKTESHWAR`
- `JN_BHASIN`
- `BABYL_KUGLER1`
- `BABYL_KUGLER2`
- `BABYL_KUGLER3`
- `BABYL_HUBER`
- `BABYL_ETPSC`
- `ALDEBARAN_15TAU`
- `HIPPARCHOS`
- `SASSANIAN`
- `J2000`
- `J1900`
- `B1950`

Os ayanamshas mais comumente usados são `FAGAN_BRADLEY` e `LAHIRI`.

Exemplo de requisição API:

```json
{
    "subject": {
        "year": 1980,
        "month": 12,
        "day": 12,
        "hour": 12,
        "minute": 12,
        "longitude": 0,
        "latitude": 51.4825766,
        "city": "London",
        "nation": "GB",
        "timezone": "Europe/London",
        "name": "John Doe",
        "zodiac_type": "sidereal",
        "sidereal_mode": "FAGAN_BRADLEY"
    }
}
```

### Sistemas de Casas

O parâmetro `house_system` define o método usado para dividir a esfera celestial em doze casas. Aqui estão as opções disponíveis:

- **A**: Equais
- **B**: Alcabitius
- **C**: Campanus
- **D**: Equais (MC)
- **F**: Carter poli-equ.
- **H**: Horizonte/Azimute
- **I**: Sunshine
- **i**: Sunshine/Alt.
- **K**: Koch
- **L**: Pullen SD
- **M**: Morinus
- **N**: Equais/1=Áries
- **O**: Porphyry
- **P**: Placidus
- **Q**: Pullen SR
- **R**: Regiomontanus
- **S**: Sripati
- **T**: Polich/Page
- **U**: Krusinski-Pisa-Goelzer
- **V**: Equais/Vehlow
- **W**: Equais/Signos Inteiros
- **X**: Sistema de rotação axial/Casas meridianas
- **Y**: Casas APC

Normalmente, o sistema de casas padrão usado é Placidus (P).

Exemplo de requisição API:

```json
{
    "subject": {
        "year": 1980,
        "month": 12,
        "day": 12,
        "hour": 12,
        "minute": 12,
        "longitude": 0,
        "latitude": 51.4825766,
        "city": "London",
        "nation": "GB",
        "timezone": "Europe/London",
        "name": "John Doe",
        "zodiac_type": "tropic",
        "house_system": "A"
    }
}
```

Isso permite especificar o sistema de casas desejado para calcular e exibir as posições dos corpos celestiais.

### Tipos de Perspectiva

O parâmetro `perspective` define o ponto de vista a partir do qual as posições dos corpos celestiais são calculadas. Aqui estão as opções disponíveis:

- "Apparent Geocentric": Centrado na Terra e mostra as posições aparentes dos corpos celestiais como visto da Terra. Esta é a mais comumente usada e a perspectiva padrão.
- "Heliocentric": Centrado no Sol.
- "Topocentric": Esta perspectiva é baseada na localização específica do observador na superfície da Terra.
- "True Geocentric": Esta perspectiva também é centrada na Terra, mas mostra as posições verdadeiras dos corpos celestiais sem as mudanças aparentes causadas pela atmosfera terrestre.
  
Normalmente, a perspectiva padrão usada é "Apparent Geocentric".

Exemplo de uso em uma requisição API:

```json
{
    "subject": {
        "year": 1980,
        "month": 12,
        "day": 12,
        "hour": 12,
        "minute": 12,
        "longitude": 0,
        "latitude": 51.4825766,
        "city": "London",
        "nation": "GB",
        "timezone": "Europe/London",
        "name": "John Doe",
        "zodiac_type": "tropic",
        "perspective": "Heliocentric"
    }
}
```

Isso permite especificar a perspectiva desejada para calcular e exibir as posições dos corpos celestiais.

### Mapas Apenas com Roda

Para gerar mapas que contenham apenas a roda zodiacal sem informações textuais, você pode usar a opção `wheel_only` em sua chamada API. Quando esta opção está definida como `True`, apenas a roda zodiacal será retornada.

Exemplo de requisição API:

```json
{
    "subject": {
        "year": 1980,
        "month": 12,
        "day": 12,
        "hour": 12,
        "minute": 12,
        "longitude": 0,
        "latitude": 51.4825766,
        "city": "London",
        "nation": "GB",
        "timezone": "Europe/London",
        "name": "John Doe",
        "zodiac_type": "tropic"
    },
    "wheel_only": true
}
```

Isso pode ser útil para criar representações visuais limpas e simples do zodíaco sem qualquer informação adicional.

## Fusos Horários

Cálculos astrológicos precisos requerem o fuso horário correto. Consulte o seguinte link para uma lista completa de fusos horários:

[Lista de Fusos Horários do Banco de Dados TZ](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)

#### Pontos Ativos e Aspectos

Para todos os endpoints de Mapas (Mapa Natal, Mapa de Trânsitos), 
Dados de Aspectos Natais e Dados de Aspectos de Sinastria, você pode personalizar quais pontos celestiais incluir e quais aspectos calcular usando os parâmetros `active_points` e `active_aspects`.

Exemplo de requisição API:

```json
{
    "subject": {
        "year": 1980,
        "month": 12,
        "day": 12,
        "hour": 12,
        "minute": 12,
        "longitude": 0,
        "latitude": 51.4825766,
        "city": "London",
        "nation": "GB",
        "timezone": "Europe/London",
        "name": "John Doe",
        "zodiac_type": "tropic"
    },
    "active_points": [
        "Sun",
        "Moon",
        "Mercury",
        "Venus",
        "Mars",
        "Jupiter",
        "Saturn",
        "Uranus",
        "Neptune",
        "Pluto",
        "Mean_Node",
        "Chiron",
        "Ascendant",
        "Medium_Coeli",
        "Mean_Lilith",
        "Mean_South_Node"
    ],
    "active_aspects": [
        {
            "name": "conjunction",
            "orb": 10
        },
        {
            "name": "opposition",
            "orb": 10
        },
        {
            "name": "trine",
            "orb": 8
        },
        {
            "name": "sextile",
            "orb": 6
        },
        {
            "name": "square",
            "orb": 5
        },
        {
            "name": "quintile",
            "orb": 1
        }
    ]
}
```

Esses parâmetros permitem:
- Especificar quais pontos celestiais incluir no mapa e cálculos
- Definir quais aspectos calcular junto com seus orbes (o grau de desvio permitido do aspecto exato)

## Coordenadas Automáticas

É possível usar coordenadas automáticas se você não quiser implementar um método diferente para calcular latitude, longitude e fuso horário.

Para fazer isso, você deve passar o parâmetro `geonames_username` dentro do objeto `subject` em cada requisição que contenha o objeto `subject`.

**Lógica**

- Se `geonames_username` estiver presente, os parâmetros `longitude`, `latitude` e `timezone` são automaticamente ignorados.
- Se **NÃO** estiver presente, todos os três parâmetros (`longitude`, `latitude` e `timezone`) devem ser especificados.

**Recomendação**

É recomendado usar coordenadas reais diretamente para maior precisão.

**Obtendo um Nome de Usuário Geonames**

Se você quiser calcular coordenadas automaticamente, precisa obter um `username` para o serviço Geonames Timezone. O serviço é gratuito para até **10.000 requisições por dia**.
Você pode obter um nome de usuário Geonames registrando-se em <a href="http://www.geonames.org/login" target="_blank">Geonames</a>.

**Exemplo**

```json
{
    "subject": {
        "year": 1980,
        "month": 12,
        "day": 12,
        "hour": 12,
        "minute": 12,
        "city": "Jamaica, New York",
        "nation": "US",
        "name": "John Doe",
        "zodiac_type": "tropic",
        "geonames_username": "SEU_USUARIO_GEONAMES"
    }
}
```

## Direitos Autorais e Licença

A Astrologer API é Software Livre/Livre de Código Aberto com licença AGPLv3. Todos os termos e condições da licença AGPLv3 se aplicam à Astrologer API.
Você pode revisar e contribuir para o código fonte através dos repositórios oficiais:

- [Astrologer API V4](https://github.com/g-battaglia/v4.astrologer-api)

A Astrologer API é desenvolvida por Giacomo Battaglia e é baseada em Kerykeion, uma biblioteca Python para cálculos astrológicos do mesmo autor. As ferramentas subjacentes são construídas sobre o Swiss Ephemeris.

Como é um serviço de API externo, integrar dados e mapas recuperados via API não impõe restrições de licenciamento, permitindo uso em projetos com licenças de código fechado.

## Uso Comercial

A Astrologer API pode ser usada livremente em aplicações comerciais de código aberto e fechado sem restrições, pois funciona como um serviço externo.

Para conformidade total, recomendamos adicionar esta declaração em seus Termos e Condições ou em outro lugar em seu site/aplicativo:

---
Dados astrológicos e mapas neste site são gerados usando [AstrologerAPI](https://rapidapi.com/gbattaglia/api/astrologer), um serviço de terceiros de código aberto licenciado sob AGPL v3. Código fonte:
- [Github da Astrologer API](https://github.com/g-battaglia/Astrologer-API)
---

Isso garante transparência total e conformidade completa de licenciamento, não deixando margem para dúvidas.


## Contato e Suporte  

Precisa de ajuda ou tem feedback? Entre em contato conosco:
[kerykeion.astrology@gmail.com](mailto:kerykeion.astrology@gmail.com)