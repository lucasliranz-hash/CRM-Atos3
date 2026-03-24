export function CoverSummary({ account }: any) {
  const date = new Date().toLocaleDateString('pt-BR')
  const seg = (account?.segment || '').toLowerCase()

  let context =
    'A eficiência da frota é um dos pilares para a rentabilidade do seu negócio. A Atos3 Tecnologia atua identificando gargalos e implementando soluções que reduzem custos e aumentam a segurança da operação.'
  if (seg.includes('transporte') || seg.includes('pesad')) {
    context =
      'No setor de transporte rodoviário, a segurança da carga e do motorista são fundamentais para a rentabilidade da operação. A Atos3 Tecnologia entende que mitigar riscos e otimizar rotas é o caminho para o crescimento escalável e sustentável.'
  } else if (seg.includes('log') || seg.includes('distribui')) {
    context =
      'Para operações logísticas e de distribuição, a previsibilidade e o cumprimento de SLAs de entrega são cruciais. Nossa solução visa reduzir gargalos operacionais e garantir visibilidade em tempo real de toda a malha.'
  } else if (seg.includes('leve') || seg.includes('servi')) {
    context =
      'Em frotas leves e de prestação de serviços, o controle de uso dos veículos e a redução de custos com manutenção e combustível são os principais desafios. Atuamos para transformar esses centros de custo em operações eficientes.'
  }

  return (
    <>
      <section className="min-h-[85vh] flex flex-col justify-center relative break-after-page">
        <div className="absolute top-0 left-0 w-full flex justify-between items-center py-6 border-b border-gray-200">
          <div className="font-black text-2xl tracking-tighter">
            Atos3 Tecnologia
          </div>
          <div className="text-sm font-bold text-gray-500 uppercase tracking-widest hidden sm:block">
            PROPOSTA COMERCIAL - ATOS3 CRM
          </div>
        </div>

        <div className="space-y-8 mt-20">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.1]">
            Projeto de
            <br />
            Performance
            <br />
            <span className="text-gray-400">Operacional</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 font-medium max-w-2xl leading-tight">
            Soluções avançadas em gestão de frota para a {account.name}.
          </p>
        </div>

        <div className="mt-32 grid grid-cols-1 sm:grid-cols-2 gap-12 border-t border-gray-200 pt-12">
          <div className="space-y-6">
            <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400">
              Apresentado para
            </h3>
            <div className="space-y-2">
              <p className="text-xl font-black">{account.name}</p>
              <p className="text-gray-600 font-medium">
                {account.segment || 'Segmento não informado'}
              </p>
              <p className="text-gray-600 font-medium">
                Frota estimada: {account.fleetEstimate || 0} veículos
              </p>
              <p className="text-gray-600 font-medium">Data: {date}</p>
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="font-bold text-sm uppercase tracking-widest text-gray-400">
              Desenvolvido por
            </h3>
            <div className="space-y-2">
              <p className="text-xl font-black">Atos3 Tecnologia</p>
              <p className="text-gray-600 font-medium">
                Performance e Segurança
              </p>
              <p className="text-gray-600 font-medium">www.atos3.com.br</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 text-center border-y border-gray-100 bg-gray-50/50 my-16 break-inside-avoid px-8 rounded-2xl">
        <h2 className="text-2xl md:text-4xl font-black italic tracking-tight text-gray-800 leading-snug max-w-4xl mx-auto">
          "Tecnologia sem gestão não gera resultado. Por isso a Atos3 acompanha
          o cliente até a geração de performance real."
        </h2>
      </section>

      <section className="space-y-8 break-inside-avoid">
        <div className="space-y-4">
          <h2 className="text-3xl font-black tracking-tight border-b-4 border-black inline-block pb-2">
            01. Sumário Executivo
          </h2>
        </div>
        <p className="text-xl leading-relaxed text-gray-700 max-w-3xl font-medium">
          {context}
        </p>
        <p className="text-xl leading-relaxed text-gray-700 max-w-3xl font-medium">
          Esta proposta detalha a implantação de um sistema robusto de controle
          e gestão, focado em transformar dados em inteligência acionável para
          sua equipe, promovendo uma cultura de segurança e eficiência.
        </p>
      </section>
    </>
  )
}
