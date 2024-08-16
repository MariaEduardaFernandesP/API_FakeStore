let produtos = []; // array para armazenar os produtos da api e produtos criados
let produtosExcluidos = new Set(); // guarda o id dos produtos que forams excluido pra eles nao voltarem de novo quando clicar no get, o set serve pra evitar que o id nao seja repitido
let produtosCriadosAtualizados = new Map(); // guarda os produtos criados e atualizados, map serve pra acessar um produto mais rapido usando id

// get - pegar
document.getElementById('botaoBuscar').addEventListener('click', () => { //adiciona um evento de click no botao do get
  fetch('https://fakestoreapi.com/products') // requisição para obter dados da api
    .then(res => res.json()) // transforma a resposta da api em json
    .then(json => { //pega os dados da resposta convertida e executa
      //passa por todos os dados da api, se o id dos produtos forem diferentes do id dos produtos excluidos, eles sao adicionados na lista dos nao excluidos
      const produtosNaoExcluidos = json.filter(produto => !produtosExcluidos.has(produto.id));

      // lista final dos produtos, olha cada produto e ve precisa colocar uma versao que foi atualizada de algum deles
      produtos = produtosNaoExcluidos.map(produto => { 
        return produtosCriadosAtualizados.get(produto.id) || produto; //ve se tem alguma atualizaçao e usa ela se tiver , se nao o || vai retornar o produto original da lista produtosNaoExcluidos
      });

      atualizarInterface(); //mostrar a lista mais recente de produtos, sincronizando com os dados mais recentes
    })

});

// post - criar 
document.getElementById('botaoCriar').addEventListener('click', () => { //adiciona um evento de click no botao do post
  //pegando as informaçoes colocadas no formulario
  const novoTitulo = document.getElementById('novoTituloCriar').value; 
  const novoPreco = document.getElementById('novoPrecoCriar').value;
  const novaDescricao = document.getElementById('novaDescricaoCriar').value;
  const novaImagem = document.getElementById('novaImagemCriar').value;
  const novaCategoria = document.getElementById('novaCategoriaCriar').value;

  fetch('https://fakestoreapi.com/products', { //fazendo a requisiçao
    method: 'POST', //metodo HTTP como POST, que é usado para enviar dados ao servidor 
    headers: {
      'Content-Type': 'application/json' //o tipo de conteudo que está sendo enviado, no caso json
    },
    body: JSON.stringify({ //dados que está sendo enviado para o servidor, em json 
      title: novoTitulo,
      price: parseFloat(novoPreco),
      description: novaDescricao,
      image: novaImagem,
      category: novaCategoria
    })
  })
    .then(res => res.json()) // transforma a resposta em json
    .then(produtoCriado => { //produtoCriado é a resposta do servidor ja convertida 
      alert(`O produto ${produtoCriado.title} foi criado!`); //avisa que foi criado

      // adiciona o novo produto ao array de produtos e no map (lista) de criados/atualizados
      produtosCriadosAtualizados.set(produtoCriado.id, produtoCriado);

      // se o produto criado não estava na lista de produtos, adiciona
      const index = produtos.findIndex(produto => produto.id === produtoCriado.id); // procura na lista de produtos para ver se já existe um produto com o mesmo id que o produto que acabou de ser criado
      if (index === -1) { // se o id nao estiver na lista, ou seja, nao estiver na lista dos produtos
        produtos.push(produtoCriado); //adiciona o produto na lista produtos
      } else {
        produtos[index] = produtoCriado; //produto já está na lista, então atualiza o produto existente na lista com as novas informações do produto criado
      }

      atualizarInterface(); //atualiza a tela com a lista de produtos mais recente, é usada sempre que a lista de produtos muda 
    })
});

// put - atualizar 
document.getElementById('botaoAtualizar').addEventListener('click', () => {//adiciona um evento de click no botao do put
  //pegando as informaçoes colocadas no formulario
  const produtoId = document.getElementById('produtoId').value;
  const novoTitulo = document.getElementById('novoTitulo').value;
  const novoPreco = document.getElementById('novoPreco').value;
  const novaDescricao = document.getElementById('novaDescricao').value;
  const novaImagem = document.getElementById('novaImagem').value;
  const novaCategoria = document.getElementById('novaCategoria').value;

  //verificando se todos os campos necessários para atualizar o produto foram preenchidos
  if (!produtoId || !novoTitulo || !novoPreco || !novaDescricao || !novaImagem || !novaCategoria) { //os campos que precisam estar preenchidos
    alert('Por favor, preencha todos os campos.'); //se estiver algum campo vazio, mostra uma msgm ao usuario 
    return; // a atualizaçao o produto nao acontece ate que todos os campos sejam preenchidos
  }

  fetch(`https://fakestoreapi.com/products/${produtoId}`, { //faz a requisiçao  com o id do produto que deve ser atualizado na url 
    method: 'PUT', // informa para a api que vai ser atualizado um produto
    headers: {
      'Content-Type': 'application/json' // avisando que o que esta sendo enviado é em json
    },
    body: JSON.stringify({ //transforma os novos dados do produto em uma string json para serem enviados 
      title: novoTitulo,
      price: parseFloat(novoPreco), //converte o preço em um número decimal
      description: novaDescricao,
      image: novaImagem,
      category: novaCategoria
    })
  })
    .then(res => res.json()) //transforma a resposta da requisiçao em json 
    .then(produtoAtualizado => { //é a resposta ja convertida, as informações do produtodepois da atualizaçao
      alert(`Produto atualizado: ${produtoAtualizado.title}`); //avisa que o produto foi atualizado

      // armazenando o produto atualizado na lista dos criados/atualizados usando o id e as informaçoes atualizados
      produtosCriadosAtualizados.set(produtoAtualizado.id, produtoAtualizado);

      // se o produto criado não estava na lista de produtos, adiciona
      const index = produtos.findIndex(produto => produto.id == produtoAtualizado.id); //procura na lista de produtos para ver se já existe um produto com o mesmo id que o produto que acabou de ser atualizado
      if (index > -1) { // se index for maior que -1, significa que o produto foi encontrado na lista 
        produtos[index] = produtoAtualizado; //atualiza o produto na lista, substituindo a versao antiga pelo produto atualizado 
      } else { //se index for -1, significa que o produto não foi encontrado na lista
        produtos.push(produtoAtualizado); // apenas adiciona o produto atualizado a lista local (e temporaria do navegador), caso ele nao esteja nela ou foi criado e por algum motivo nao apareceu
      }

      atualizarInterface(); // atualiza a tela com a lista de produtos mais recente, é usada sempre que a lista de produtos muda 
    })
});

// patch - atualizar parcialmente
document.getElementById('botaoAtualizarParcial').addEventListener('click', () => { //adiciona um evento de click no botao do patch
  //pegando as informaçoes colocadas no formulario
  const produtoId = document.getElementById('produtoIdParcial').value;
  const novoTitulo = document.getElementById('novoTituloParcial').value;
  const novoPreco = document.getElementById('novoPrecoParcial').value;
  const novaDescricao = document.getElementById('novaDescricaoParcial').value;
  const novaImagem = document.getElementById('novaImagemParcial').value;
  const novaCategoria = document.getElementById('novaCategoriaParcial').value;

  if (!produtoId) { //verifica se o campo do id do produto esta vazio 
    alert('Por favor, informe o ID do produto.'); //manda uma msgm pedindo para informar o id
    return; //nada vai acontecer se o id do produto não foi fornecido
  }


  const produtoExistente = produtos.find(produto => produto.id == produtoId); //procura na lista de produtos um produto que tenha o mesmo id fornecido e retorna se achar
  if (!produtoExistente) { //se nao achar
    alert('Produto não encontrado.'); //mostra uma mensagem dizendo que nao achou
    return; // e para a execuçao do codigo
  }

  //armazena as novas informaçoes que vai atualizar o produto, se não fornecer uma nova informação ele mantem a informaçao antiga
  const atualizacoes = {
    title: novoTitulo || produtoExistente.title, //se tiver um titulo novo usa ele, se nao mantem o atual 
    price: novoPreco ? parseFloat(novoPreco) : produtoExistente.price, //se tiver um preço novo usa ele, se nao mantem o atual 
    description: novaDescricao || produtoExistente.description, //se tiver uma descriçao nova usa ela, se nao mantem a atual 
    image: novaImagem || produtoExistente.image, //se tiver uma imagem nova usa ela, se nao mantem a atual 
    category: novaCategoria || produtoExistente.category //se tiver uma categoria nova usa ela, se nao mantem a atual 
  };

  fetch(`https://fakestoreapi.com/products/${produtoId}`, { //faz a requisiçao  com o id do produto que deve ser atualizado na url 
    method: 'PATCH', // informa para a api que vai ser atualizado parcialmente um produto
    headers: {
      'Content-Type': 'application/json' // avisando que o que esta sendo enviado é em json
    },
    body: JSON.stringify(atualizacoes) //transforma as novas informaçoes do produto em uma string json para serem enviados 
  })
    .then(res => res.json()) //transforma a resposta da requisiçao em json 
    .then(produtoAtualizado => { //é a resposta do servidor ja convertida 
      alert(`Produto parcialmente atualizado: ${produtoAtualizado.title}`); //exibe uma msgm dizendo que deu certo

      // atualiza o produto na lista de produtos criados/atualizados 
      produtosCriadosAtualizados.set(produtoAtualizado.id, produtoAtualizado);

      // Atualiza o produto na lista de produtos
      const index = produtos.findIndex(produto => produto.id == produtoAtualizado.id); //procura na lista local de produtos o produto que tem o mesmo id que o produto que acabou de ser atualizado e retorna a posiçao dele
      if (index > -1) { // significa que o produto ja esta na lista, entao o proximo passo é atualizar esse produto 
        produtos[index] = produtoAtualizado; //atualiza as informaçoes do produto
      } else { //o produto nao estava na lista local
        produtos.push(produtoAtualizado); // adiciona na lista, isso garante que mesmo se o produto não estava na lista (talvez porque foi criado recentemente), ele sera adicionado agora
      }

      atualizarInterface(); // atualiza a tela com a lista de produtos mais recente, é usada sempre que a lista de produtos muda 
    })
});

// delete - excluir
document.getElementById('botaoExcluir').addEventListener('click', () => { //adiciona um evento de click no botao excluir do html
  const produtoId = document.getElementById('excluirProdutoId').value; //pega o id que o usuario colocou no id 

  if (!produtoId) { //se o campo id estiver vazio 
    alert('Por favor, forneça o ID do produto.'); // exibe uma msgm de alerta para o usuario pedindo o id
    return; // para a execuçao do codigo
  }

  fetch(`https://fakestoreapi.com/products/${produtoId}`, {// faz a requisiçao com o id do produto que deve ser atualizado na url 
    method: 'DELETE' //informa o metodo
  })
    .then(res => res.json()) //transforma a resposta da requisiçao em json 
    .then(() => { //apos a requisiçao ter dado certo, faz uma açao
      alert(`Produto ${produtoId} excluído com sucesso!`); //confirma ao usuario que foi apagado
      
      // remove o produto da lista de produtos criados/atualizados garantindo que ele nao apareça mais 
      produtosCriadosAtualizados.delete(Number(produtoId)); //o number transforma a string do id em um numero 

      // adiciona o produto na lista de produtos excluidos
      produtosExcluidos.add(Number(produtoId));

      // atualiza a lista de produtos removendo o produto que foi apagado 
      produtos = produtos.filter(produto => produto.id != produtoId); //filter é um metodo que cria uma nova lista (ou array) com condiçoes

      atualizarInterface(); // atualiza a tela com a lista de produtos mais recente, é usada sempre que a lista de produtos muda 
    })
});

// Função para obter um único produto por ID
function obterProdutoPorId() {
  const produtoId = document.getElementById('produtoIdUnico').value.trim();
  if (!produtoId) {
      alert('Por favor, informe o ID do produto.');
      return;
  }

  fetch(`https://fakestoreapi.com/products/${produtoId}`)
      .then(res => {
          if (!res.ok) {
              throw new Error('Produto não encontrado.');
          }
          return res.json();
      })
      .then(produto => {
          const container = document.getElementById('produtoUnico');
          container.innerHTML = ''; // Limpa o conteúdo anterior

          // Exibe as informações do produto
          container.innerHTML = `
              <h2>${produto.title}</h2>
              <p>${produto.description}</p>
              <p><strong>Preço:</strong> $${produto.price}</p>
              <img src="${produto.image}" alt="${produto.title}" width="100" />
          `;
      })
      .catch(error => {
          alert(error.message);
          document.getElementById('produtoUnico').innerHTML = '';
      });
}

// Adiciona o evento ao botão de buscar produto por ID
document.getElementById('botaoBuscarUnico').addEventListener('click', obterProdutoPorId);


// Função para limitar o número de produtos e atualizar a interface
function limitarProdutos() {
  const limite = document.getElementById('limiteProdutos').value;
  if (!limite || limite <= 0) {
      alert('Por favor, insira um número válido de produtos.');
      return;
  }

  fetch(`https://fakestoreapi.com/products?limit=${limite}`)
      .then(res => {
          if (!res.ok) {
              throw new Error('Erro ao obter produtos.');
          }
          return res.json();
      })
      .then(produtos => {
          const container = document.getElementById('containerProdutosLimitados');
          container.innerHTML = ''; // Limpa o conteúdo anterior

          produtos.forEach(produto => {
              const produtoDiv = document.createElement('div');
              produtoDiv.className = 'produto';
              produtoDiv.innerHTML = `
                  <h2>${produto.title}</h2>
                  <p>${produto.description}</p>
                  <p><strong>Preço:</strong> $${produto.price}</p>
                  <img src="${produto.image}" alt="${produto.title}" width="100" />
              `;
              container.appendChild(produtoDiv);
          });
      })
      .catch(error => {
          alert(error.message);
          document.getElementById('containerProdutosLimitados').innerHTML = '';
      });
}
// Adiciona o evento ao botão de limitar
document.getElementById('botaoLimitar').addEventListener('click', limitarProdutos);

// Função para classificar os produtos e atualizar a interface
function classificarProdutos() {
  const ordem = document.getElementById('ordemClassificacao').value;
  if (!ordem) {
      alert('Por favor, selecione uma ordem de classificação.');
      return;
  }

  fetch(`https://fakestoreapi.com/products?sort=${ordem}`)
      .then(res => {
          if (!res.ok) {
              throw new Error('Erro ao obter produtos.');
          }
          return res.json();
      })
      .then(produtos => {
          const container = document.getElementById('containerProdutosClassificados');
          container.innerHTML = ''; // Limpa o conteúdo anterior

          produtos.forEach(produto => {
              const produtoDiv = document.createElement('div');
              produtoDiv.className = 'produto';
              produtoDiv.innerHTML = `
                  <h2>${produto.title}</h2>
                  <p>${produto.description}</p>
                  <p><strong>Preço:</strong> $${produto.price}</p>
                  <img src="${produto.image}" alt="${produto.title}" width="100" />
              `;
              container.appendChild(produtoDiv);
          });
      })
      .catch(error => {
          alert(error.message);
          document.getElementById('containerProdutosClassificados').innerHTML = '';
      });
}


// Adiciona o evento ao botão de classificar
document.getElementById('botaoClassificar').addEventListener('click', classificarProdutos);

// Função para obter todas as categorias e atualizar a interface
function obterCategorias() {
  fetch('https://fakestoreapi.com/products/categories')
      .then(res => {
          if (!res.ok) {
              throw new Error('Erro ao obter categorias.');
          }
          return res.json();
      })
      .then(categorias => {
          const lista = document.getElementById('listaCategorias');
          lista.innerHTML = ''; // Limpa o conteúdo anterior

          // Adiciona cada categoria à lista
          categorias.forEach(categoria => {
              const listItem = document.createElement('li');
              listItem.textContent = categoria;
              lista.appendChild(listItem);
          });
      })
      .catch(error => {
          alert(error.message);
          document.getElementById('listaCategorias').innerHTML = '';
      });
}

// Adiciona o evento ao botão de obter categorias
document.getElementById('botaoCategorias').addEventListener('click', obterCategorias);

// Função para obter produtos de uma categoria específica e atualizar a interface
function obterProdutosPorCategoria() {
  const categoria = document.getElementById('categoriaParaBuscar').value.trim();
  if (!categoria) {
      alert('Por favor, informe a categoria.');
      return;
  }

  fetch(`https://fakestoreapi.com/products/category/${categoria}`)
      .then(res => {
          if (!res.ok) {
              throw new Error('Erro ao obter produtos da categoria.');
          }
          return res.json();
      })
      .then(produtos => {
          const container = document.getElementById('produtosPorCategoria');
          container.innerHTML = ''; // Limpa o conteúdo anterior

          // Exibe os produtos da categoria
          produtos.forEach(produto => {
              const produtoDiv = document.createElement('div');
              produtoDiv.className = 'produto';
              produtoDiv.innerHTML = `
                  <h2>${produto.title}</h2>
                  <p>${produto.description}</p>
                  <p><strong>Preço:</strong> $${produto.price}</p>
                  <img src="${produto.image}" alt="${produto.title}" width="100" />
              `;
              container.appendChild(produtoDiv);
          });
      })
      .catch(error => {
          alert(error.message);
          document.getElementById('produtosPorCategoria').innerHTML = '';
      });
}

// Adiciona o evento ao botão de buscar produtos por categoria
document.getElementById('botaoBuscarCategoria').addEventListener('click', obterProdutosPorCategoria);

// funçao pque atualiza a interface
function atualizarInterface() {
  const container = document.getElementById('containerProdutos'); //pega o container onde vai aparecer os produtos
  container.innerHTML = ''; //limpa o conteudo dentro dele, deixando vazio

  // cria uma lista final de todos os produtos que serao exibidos, combinando produtos existentes com produtos que foram criados ou atualizados e sem incluir os excluidos
  const todosProdutos = produtos.concat(Array.from(produtosCriadosAtualizados.values()).filter(produto => !produtosExcluidos.has(produto.id))); //concat junta dois arrays em um, filter cria um novo array apenas com os produtos que atendem condiçoes especificadas (o id nao deve ser iguaal ao id dos excluidos)

  // remove produtos duplicados, mantendo a versao mais recente, garantindo que cada produto na lista final tenha um id unico
  const produtosUnicos = new Map(todosProdutos.map(produto => [produto.id, produto])); //para cada produto cria um array com duas partes: o id e o objeto 

  // exibe os produtos únicos na tela
  produtosUnicos.forEach(produto => { // entra em cada produto no map e executa a funçao fornecida para cada um
    const produtoDiv = document.createElement('div'); // cria uma div para colocar as informaços de cada produto 
    produtoDiv.className = 'produto'; //define a class pra estilizar

    //definindo o id 
    produtoDiv.innerHTML = `
      <h2>${produto.title}</h2>
      <p>${produto.description}</p>
      <p><strong>Preço:</strong> $${produto.price}</p>
      <img src="${produto.image}" alt="${produto.title}" width="100" />
    `;
   // coloca a div do produto (com todas as suas informações) dentro do elemento container
    container.appendChild(produtoDiv);
  });
}
