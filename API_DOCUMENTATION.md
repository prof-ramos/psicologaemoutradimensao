# Astrologer API - Documentação Técnica Completa

## Visão Geral da Arquitetura

### Separação Front-end/Back-end

A aplicação Astrologer API segue uma arquitetura modular bem definida com clara separação de responsabilidades:

#### Back-end (Python/FastAPI)
- **Responsabilidades**: Processamento astrológico, validação de dados, geração de gráficos SVG, gerenciamento de API
- **Tecnologias**: FastAPI, Pydantic, Kerykeion (biblioteca astrológica), Uvicorn
- **Estrutura Modular**:
  - `app/routers/`: Endpoints da API
  - `app/types/`: Modelos de dados (request/response)
  - `app/config/`: Configurações e settings
  - `app/middleware/`: Middlewares personalizados
  - `app/utils/`: Utilitários auxiliares

#### Front-end (HTML/CSS/JavaScript)
- **Responsabilidades**: Interface de usuário, coleta de dados do usuário, exibição de resultados
- **Tecnologias**: HTML5, CSS3, JavaScript (Vanilla)
- **Estrutura**:
  - `frontend/index.html`: Interface principal
  - `frontend/styles.css`: Estilos visuais
  - `frontend/script.js`: Lógica de interação com API

### Princípios Arquiteturais

1. **Separação de Responsabilidades**: Back-end focado em lógica de negócio, front-end em UX
2. **API-First Design**: API RESTful bem documentada como contrato principal
3. **Validação Robusta**: Pydantic para validação de entrada/saída
4. **Configuração Centralizada**: Settings unificados via Pydantic
5. **Middleware Pattern**: Autenticação, CORS, logging estruturado
6. **Tratamento de Erros**: Respostas padronizadas com códigos HTTP apropriados

---

## Especificação da API

### Base URL
```
https://astrologer.p.rapidapi.com/api/v4/
```

### Autenticação
Todos os endpoints requerem headers de autenticação RapidAPI:
```
X-RapidAPI-Key: YOUR_API_KEY
X-RapidAPI-Host: astrologer.p.rapidapi.com
```

### Formatos de Dados
- **Request**: JSON
- **Response**: JSON padronizado
- **Encoding**: UTF-8

---

## Endpoints da API

### 1. GET /api/v4/now

**Descrição Funcional**
Recupera dados astrológicos para o horário UTC atual, útil para demonstrações e testes.

**Método HTTP**: GET

**Parâmetros de Entrada**: Nenhum

**Formato de Requisição**: N/A

**Formato de Resposta**:
```json
{
  "status": "OK",
  "data": {
    "name": "Now",
    "year": 2024,
    "month": 12,
    "day": 25,
    "hour": 15,
    "minute": 30,
    "city": "GMT",
    "nation": "UK",
    "lng": -0.001545,
    "lat": 51.477928,
    "tz_str": "GMT",
    "zodiac_type": "Tropic",
    "local_time": "2024-12-25 15:30:00+00:00",
    "utc_time": "2024-12-25 15:30:00+00:00",
    "julian_day": 2460635.145833,
    "sun": {...},
    "moon": {...},
    // ... outros planetas
  }
}
```

**Códigos de Status Possíveis**:
- `200`: Sucesso
- `500`: Erro interno do servidor

**Exemplo de Uso**:
```bash
curl -X GET "https://astrologer.p.rapidapi.com/api/v4/now" \
  -H "X-RapidAPI-Key: YOUR_API_KEY" \
  -H "X-RapidAPI-Host: astrologer.p.rapidapi.com"
```

**Restrições e Validações**:
- Endpoint público, não requer dados de entrada
- Sempre retorna dados para coordenadas de Londres (GMT)

---

### 2. POST /api/v4/birth-data

**Descrição Funcional**
Calcula dados astrológicos completos para uma data de nascimento específica, incluindo posições planetárias, casas astrológicas e fase lunar. Não inclui gráfico visual nem aspectos.

**Método HTTP**: POST

**Parâmetros de Entrada**:
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| subject | SubjectModel | Sim | Dados do sujeito astrológico |

**Formato de Requisição**:
```json
{
  "subject": {
    "name": "João Silva",
    "year": 1990,
    "month": 5,
    "day": 15,
    "hour": 14,
    "minute": 30,
    "city": "São Paulo, SP",
    "nation": "BR",
    "geonames_username": true,
    "zodiac_type": "Tropic"
  }
}
```

**Formato de Resposta**:
```json
{
  "status": "OK",
  "data": {
    "name": "João Silva",
    "year": 1990,
    "month": 5,
    "day": 15,
    "hour": 14,
    "minute": 30,
    "city": "São Paulo, SP",
    "nation": "BR",
    "lng": -46.633308,
    "lat": -23.550520,
    "tz_str": "America/Sao_Paulo",
    "zodiac_type": "Tropic",
    "local_time": "1990-05-15 14:30:00-03:00",
    "utc_time": "1990-05-15 17:30:00+00:00",
    "julian_day": 2448028.229167,
    "sun": {
      "name": "Sun",
      "quality": "Mutable",
      "element": "Air",
      "sign": "Tau",
      "sign_num": 1,
      "position": 24.5,
      "abs_pos": 54.5,
      "emoji": "♉️",
      "point_type": "Planet",
      "house": "Third_House",
      "retrograde": false
    },
    // ... outros planetas, casas, nós lunares, fase lunar
  }
}
```

**Códigos de Status Possíveis**:
- `200`: Dados calculados com sucesso
- `400`: Erro de geocodificação (cidade não encontrada)
- `422`: Dados de entrada inválidos
- `500`: Erro interno do servidor

**Exemplo de Uso**:
```bash
curl -X POST "https://astrologer.p.rapidapi.com/api/v4/birth-data" \
  -H "X-RapidAPI-Key: YOUR_API_KEY" \
  -H "X-RapidAPI-Host: astrologer.p.rapidapi.com" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": {
      "name": "João Silva",
      "year": 1990,
      "month": 5,
      "day": 15,
      "hour": 14,
      "minute": 30,
      "city": "São Paulo, SP",
      "nation": "BR",
      "geonames_username": true,
      "zodiac_type": "Tropic"
    }
  }'
```

**Restrições e Validações**:
- Ano: 1800-2100
- Mês: 1-12
- Dia: 1-31 (validado por mês/ano)
- Hora: 0-23
- Minuto: 0-59
- Cidade deve existir no serviço Geonames
- País deve ser código ISO 3166-1 alpha-2

---

### 3. POST /api/v4/birth-chart

**Descrição Funcional**
Gera um mapa astral completo incluindo dados astrológicos, gráfico SVG visual e lista de aspectos planetários para uma data de nascimento específica.

**Método HTTP**: POST

**Parâmetros de Entrada**:
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| subject | SubjectModel | Sim | Dados do sujeito astrológico |
| theme | str | Não | Tema visual do gráfico (light/dark/classic) |
| language | str | Não | Idioma do gráfico (EN/PT/ES/FR/IT) |
| wheel_only | bool | Não | Apenas roda zodiacal (sem texto) |
| active_points | list | Não | Pontos celestes a incluir |
| active_aspects | list | Não | Tipos de aspectos a calcular |

**Formato de Requisição**:
```json
{
  "subject": {
    "name": "João Silva",
    "year": 1990,
    "month": 5,
    "day": 15,
    "hour": 14,
    "minute": 30,
    "city": "São Paulo, SP",
    "nation": "BR",
    "geonames_username": true,
    "zodiac_type": "Tropic"
  },
  "theme": "light",
  "language": "PT",
  "wheel_only": false
}
```

**Formato de Resposta**:
```json
{
  "status": "OK",
  "data": {
    // Dados completos do sujeito (igual ao birth-data)
  },
  "chart": "<svg xmlns='http://www.w3.org/2000/svg'...></svg>",
  "aspects": [
    {
      "p1_name": "Sun",
      "p1_abs_pos": 54.5,
      "p2_name": "Moon",
      "p2_abs_pos": 123.7,
      "aspect": "trine",
      "orbit": 2.3,
      "aspect_degrees": 120,
      "diff": 69.2,
      "p1": 0,
      "p2": 1
    }
    // ... outros aspectos
  ]
}
```

**Códigos de Status Possíveis**:
- `200`: Mapa gerado com sucesso
- `400`: Erro de geocodificação
- `422`: Dados inválidos
- `500`: Erro na geração do gráfico

**Exemplo de Uso**:
```bash
curl -X POST "https://astrologer.p.rapidapi.com/api/v4/birth-chart" \
  -H "X-RapidAPI-Key: YOUR_API_KEY" \
  -H "X-RapidAPI-Host: astrologer.p.rapidapi.com" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": {
      "name": "João Silva",
      "year": 1990,
      "month": 5,
      "day": 15,
      "hour": 14,
      "minute": 30,
      "city": "São Paulo, SP",
      "nation": "BR",
      "geonames_username": true,
      "zodiac_type": "Tropic"
    },
    "theme": "light",
    "language": "PT"
  }'
```

**Restrições e Validações**:
- Mesmas validações do birth-data
- Tema deve ser: light, dark, dark-high-contrast, classic
- Linguagem deve ser: EN, PT, ES, FR, IT, TR, RU, CN, DE, HI
- wheel_only afeta apenas a saída visual

---

### 4. POST /api/v4/synastry-chart

**Descrição Funcional**
Cria um mapa de sinastria comparando dois sujeitos astrológicos, mostrando suas interações e compatibilidade através de um gráfico SVG e lista de aspectos interpessoais.

**Método HTTP**: POST

**Parâmetros de Entrada**:
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| first_subject | SubjectModel | Sim | Primeiro sujeito |
| second_subject | SubjectModel | Sim | Segundo sujeito |
| theme | str | Não | Tema visual |
| language | str | Não | Idioma |
| wheel_only | bool | Não | Apenas roda zodiacal |
| active_points | list | Não | Pontos ativos |
| active_aspects | list | Não | Aspectos ativos |

**Formato de Requisição**:
```json
{
  "first_subject": {
    "name": "João Silva",
    "year": 1990,
    "month": 5,
    "day": 15,
    "hour": 14,
    "minute": 30,
    "city": "São Paulo, SP",
    "nation": "BR",
    "geonames_username": true
  },
  "second_subject": {
    "name": "Maria Santos",
    "year": 1992,
    "month": 8,
    "day": 22,
    "hour": 9,
    "minute": 45,
    "city": "Rio de Janeiro, RJ",
    "nation": "BR",
    "geonames_username": true
  },
  "theme": "dark",
  "language": "PT"
}
```

**Formato de Resposta**:
```json
{
  "status": "OK",
  "chart": "<svg xmlns='http://www.w3.org/2000/svg'...></svg>",
  "aspects": [
    {
      "p1_name": "Sun",
      "p1_abs_pos": 54.5,
      "p2_name": "Venus",
      "p2_abs_pos": 123.7,
      "aspect": "conjunction",
      "orbit": 1.2,
      "aspect_degrees": 0,
      "diff": 69.2,
      "p1": 0,
      "p2": 3
    }
  ],
  "data": {
    "first_subject": {
      // Dados completos do primeiro sujeito
    },
    "second_subject": {
      // Dados completos do segundo sujeito
    }
  }
}
```

**Códigos de Status Possíveis**:
- `200`: Sinastria calculada com sucesso
- `400`: Erro de geocodificação
- `422`: Dados inválidos
- `500`: Erro na geração

**Exemplo de Uso**:
```bash
curl -X POST "https://astrologer.p.rapidapi.com/api/v4/synastry-chart" \
  -H "X-RapidAPI-Key: YOUR_API_KEY" \
  -H "X-RapidAPI-Host: astrologer.p.rapidapi.com" \
  -H "Content-Type: application/json" \
  -d '{
    "first_subject": {
      "name": "João Silva",
      "year": 1990,
      "month": 5,
      "day": 15,
      "hour": 14,
      "minute": 30,
      "city": "São Paulo, SP",
      "nation": "BR",
      "geonames_username": true
    },
    "second_subject": {
      "name": "Maria Santos",
      "year": 1992,
      "month": 8,
      "day": 22,
      "hour": 9,
      "minute": 45,
      "city": "Rio de Janeiro, RJ",
      "nation": "BR",
      "geonames_username": true
    },
    "theme": "dark",
    "language": "PT"
  }'
```

**Restrições e Validações**:
- Ambos os sujeitos devem ter dados válidos
- Mesmas validações individuais aplicam-se a cada sujeito

---

### 5. POST /api/v4/transit-chart

**Descrição Funcional**
Gera um mapa de trânsitos mostrando as influências planetárias atuais sobre um mapa natal específico, útil para análise de períodos transitórios.

**Método HTTP**: POST

**Parâmetros de Entrada**:
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| first_subject | SubjectModel | Sim | Sujeito natal |
| transit_subject | TransitSubjectModel | Sim | Data do trânsito |
| theme | str | Não | Tema visual |
| language | str | Não | Idioma |
| wheel_only | bool | Não | Apenas roda |
| active_points | list | Não | Pontos ativos |
| active_aspects | list | Não | Aspectos ativos |

**Formato de Requisição**:
```json
{
  "first_subject": {
    "name": "João Silva",
    "year": 1990,
    "month": 5,
    "day": 15,
    "hour": 14,
    "minute": 30,
    "city": "São Paulo, SP",
    "nation": "BR",
    "geonames_username": true
  },
  "transit_subject": {
    "year": 2024,
    "month": 12,
    "day": 25,
    "hour": 15,
    "minute": 30,
    "city": "São Paulo, SP",
    "nation": "BR",
    "geonames_username": true
  },
  "theme": "classic",
  "language": "PT"
}
```

**Formato de Resposta**:
```json
{
  "status": "OK",
  "chart": "<svg xmlns='http://www.w3.org/2000/svg'...></svg>",
  "aspects": [
    {
      "p1_name": "Sun",
      "p1_abs_pos": 54.5,
      "p2_name": "Saturn",
      "p2_abs_pos": 270.1,
      "aspect": "square",
      "orbit": 3.2,
      "aspect_degrees": 90,
      "diff": 215.6,
      "p1": 0,
      "p2": 6
    }
  ],
  "data": {
    "subject": {
      // Dados do sujeito natal
    },
    "transit": {
      // Dados do trânsito
    }
  }
}
```

**Códigos de Status Possíveis**:
- `200`: Trânsito calculado com sucesso
- `400`: Erro de geocodificação
- `422`: Dados inválidos
- `500`: Erro na geração

---

### 6. POST /api/v4/relationship-score

**Descrição Funcional**
Calcula uma pontuação de compatibilidade entre dois sujeitos usando o método Ciro Discepolo, retornando score numérico, descrição e aspectos relevantes.

**Método HTTP**: POST

**Parâmetros de Entrada**:
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| first_subject | SubjectModel | Sim | Primeiro sujeito |
| second_subject | SubjectModel | Sim | Segundo sujeito |

**Formato de Requisição**:
```json
{
  "first_subject": {
    "name": "João Silva",
    "year": 1990,
    "month": 5,
    "day": 15,
    "hour": 14,
    "minute": 30,
    "city": "São Paulo, SP",
    "nation": "BR",
    "geonames_username": true
  },
  "second_subject": {
    "name": "Maria Santos",
    "year": 1992,
    "month": 8,
    "day": 22,
    "hour": 9,
    "minute": 45,
    "city": "Rio de Janeiro, RJ",
    "nation": "BR",
    "geonames_username": true
  }
}
```

**Formato de Resposta**:
```json
{
  "status": "OK",
  "score": 24,
  "score_description": "Important relationship",
  "is_destiny_sign": false,
  "aspects": [
    {
      "p1_name": "Sun",
      "p1_abs_pos": 54.5,
      "p2_name": "Moon",
      "p2_abs_pos": 123.7,
      "aspect": "trine",
      "orbit": 2.3,
      "aspect_degrees": 120,
      "diff": 69.2,
      "p1": 0,
      "p2": 1
    }
  ],
  "data": {
    "first_subject": {
      // Dados completos
    },
    "second_subject": {
      // Dados completos
    }
  }
}
```

**Códigos de Status Possíveis**:
- `200`: Score calculado com sucesso
- `400`: Erro de geocodificação
- `422`: Dados inválidos
- `500`: Erro no cálculo

**Escala de Scores**:
- 0-5: Relacionamento mínimo
- 5-10: Relacionamento médio
- 10-15: Relacionamento importante
- 15-20: Relacionamento muito importante
- 20-35: Relacionamento excepcional
- 30+: Relacionamento raro excepcional

---

### 7. POST /api/v4/composite-chart

**Descrição Funcional**
Calcula um mapa composto usando o método do ponto médio entre dois sujeitos, representando a energia conjunta do relacionamento.

**Método HTTP**: POST

**Parâmetros de Entrada**:
| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|-------------|-----------|
| first_subject | SubjectModel | Sim | Primeiro sujeito |
| second_subject | SubjectModel | Sim | Segundo sujeito |
| theme | str | Não | Tema visual |
| language | str | Não | Idioma |
| wheel_only | bool | Não | Apenas roda |
| active_points | list | Não | Pontos ativos |
| active_aspects | list | Não | Aspectos ativos |

**Formato de Resposta**:
```json
{
  "status": "OK",
  "chart": "<svg xmlns='http://www.w3.org/2000/svg'...></svg>",
  "aspects": [
    // Aspectos do mapa composto
  ],
  "data": {
    "composite_subject": {
      // Dados do mapa composto
    },
    "first_subject": {
      // Dados do primeiro sujeito
    },
    "second_subject": {
      // Dados do segundo sujeito
    }
  }
}
```

---

### 8-10. Endpoints de Dados Apenas

**Descrição Geral**: Versões dos endpoints acima que retornam apenas dados e aspectos, sem gráficos SVG. Úteis para integrações que não precisam de visualização.

- `POST /api/v4/synastry-aspects-data`
- `POST /api/v4/natal-aspects-data`
- `POST /api/v4/transit-aspects-data`
- `POST /api/v4/composite-aspects-data`

**Diferenças**:
- Não incluem campo `chart` na resposta
- Mesmo formato de dados e aspectos
- Menor payload de resposta

---

## Modelos de Dados

### SubjectModel
```typescript
interface SubjectModel {
  name: string;
  year: number; // 1800-2100
  month: number; // 1-12
  day: number; // 1-31 (validado por mês)
  hour: number; // 0-23
  minute: number; // 0-59
  city: string;
  nation?: string; // Código ISO 3166-1 alpha-2
  longitude?: number; // -180 to 180
  latitude?: number; // -90 to 90
  timezone?: string; // IANA timezone
  geonames_username?: string | boolean;
  zodiac_type?: "Tropic" | "Sidereal";
  sidereal_mode?: string;
  houses_system_identifier?: string;
  perspective_type?: string;
}
```

### AspectModel
```typescript
interface AspectModel {
  p1_name: string; // Nome do primeiro ponto
  p1_abs_pos: number; // Posição absoluta do primeiro ponto
  p2_name: string; // Nome do segundo ponto
  p2_abs_pos: number; // Posição absoluta do segundo ponto
  aspect: string; // Tipo de aspecto
  orbit: number; // Órbita do aspecto
  aspect_degrees: number; // Graus do aspecto
  diff: number; // Diferença entre pontos
  p1: number; // ID do primeiro ponto
  p2: number; // ID do segundo ponto
}
```

---

## Tratamento de Erros

### Estrutura Padrão de Erro
```json
{
  "status": "ERROR",
  "message": "Descrição detalhada do erro"
}
```

### Códigos de Status HTTP
- `200`: Sucesso
- `400`: Dados inválidos ou geocodificação falhou
- `422`: Validação de entrada falhou
- `500`: Erro interno do servidor

### Tipos de Erro Comuns
1. **Geocodificação**: Cidade não encontrada no Geonames
2. **Validação**: Dados fora dos limites permitidos
3. **Servidor**: Erros internos na geração de gráficos

---

## Configurações e Personalização

### Sistemas de Casas
- P: Placidus (padrão)
- A: Equal
- B: Alcabitius
- C: Campanus
- D: Equal (MC)
- F: Carter poli-equ
- H: Horizon/Azimuth
- I: Sunshine
- K: Koch
- M: Morinus
- O: Porphyry
- Q: Pullen SR
- R: Regiomontanus
- T: Polich/Page
- U: Krusinski-Pisa-Goelzer
- V: Equal/Vehlow
- W: Equal/Whole Sign
- X: Axial rotation system
- Y: APC houses

### Tipos de Zodíaco
- **Tropic**: Zodíaco Tropical (padrão)
- **Sidereal**: Zodíaco Sideral (requer sidereal_mode)

### Modos Siderais
- FAGAN_BRADLEY
- LAHIRI
- DELUCE
- RAMAN
- USHASHASHI
- KRISHNAMURTI
- DJWHAL_KHUL
- YUKTESHWAR
- JN_BHASIN
- BABYL_KUGLER1
- BABYL_KUGLER2
- BABYL_KUGLER3
- BABYL_HUBER
- BABYL_ETPSC
- ALDEBARAN_15TAU
- HIPPARCHOS
- SASSANIAN
- J2000
- J1900
- B1950

### Perspectivas
- Apparent Geocentric (padrão)
- Heliocentric
- Topocentric
- True Geocentric

---

## Considerações de Performance

### Limites de Rate
- 10.000 requisições/dia para Geonames (gratuito)
- Rate limits do RapidAPI aplicam-se

### Otimização
- Gráficos SVG são minificados
- Dados calculados apenas quando necessário
- Cache de coordenadas Geonames

### Payloads
- Respostas com gráficos: ~50-100KB
- Respostas apenas dados: ~5-10KB
- Timeout padrão: 30 segundos

---

## Exemplos de Integração

### JavaScript/Node.js
```javascript
const axios = require('axios');

async function getBirthChart(name, birthDate, city) {
  const response = await axios.post('https://astrologer.p.rapidapi.com/api/v4/birth-chart', {
    subject: {
      name: name,
      year: birthDate.getFullYear(),
      month: birthDate.getMonth() + 1,
      day: birthDate.getDate(),
      hour: birthDate.getHours(),
      minute: birthDate.getMinutes(),
      city: city,
      nation: 'BR',
      geonames_username: true
    },
    theme: 'light',
    language: 'PT'
  }, {
    headers: {
      'X-RapidAPI-Key': 'YOUR_API_KEY',
      'X-RapidAPI-Host': 'astrologer.p.rapidapi.com',
      'Content-Type': 'application/json'
    }
  });
  
  return response.data;
}
```

### Python
```python
import requests

def get_relationship_score(subject1, subject2):
    url = "https://astrologer.p.rapidapi.com/api/v4/relationship-score"
    payload = {
        "first_subject": subject1,
        "second_subject": subject2
    }
    headers = {
        "X-RapidAPI-Key": "YOUR_API_KEY",
        "X-RapidAPI-Host": "astrologer.p.rapidapi.com",
        "Content-Type": "application/json"
    }
    
    response = requests.post(url, json=payload, headers=headers)
    return response.json()
```

---

## Suporte e Contato

- **Documentação**: https://www.kerykeion.net/astrologer-api-swagger/
- **Email**: kerykeion.astrology@gmail.com
- **Licença**: AGPL-3.0
- **Repositório**: https://github.com/g-battaglia/Astrologer-API

---

*Esta documentação foi gerada automaticamente baseada na especificação OpenAPI da Astrologer API v4.0.0*