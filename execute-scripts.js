import pg from 'pg'
import fs from 'fs'

const { Client } = pg

// Configuração da conexão
const client = new Client({
  connectionString: 'postgresql://postgres:QMr4iacgEJD0ROKu@82.25.69.57:5507/postgres'
})

async function executeScript(scriptPath) {
  try {
    console.log(`\n🚀 Executando ${scriptPath}...`)
    
    const sqlContent = fs.readFileSync(scriptPath, 'utf8')
    
    // Executar o script completo
    const result = await client.query(sqlContent)
    
    console.log(`✅ ${scriptPath} executado com sucesso!`)
    
    // Se há resultados, mostrar alguns
    if (result.rows && result.rows.length > 0) {
      console.log('📊 Últimos resultados:', result.rows.slice(-3))
    }
    
    return true
  } catch (error) {
    console.error(`❌ Erro executando ${scriptPath}:`, error.message)
    return false
  }
}

async function main() {
  try {
    // Conectar ao banco
    console.log('🔌 Conectando ao banco de dados...')
    await client.connect()
    console.log('✅ Conectado com sucesso!')
    
    // Executar apenas o script de autenticação adaptado
    const scripts = [
      'sql/05_auth_adaptado.sql'
    ]
    
    // Executar cada script
    for (const script of scripts) {
      const success = await executeScript(script)
      
      if (!success) {
        console.log(`❌ Parando execução devido ao erro em ${script}`)
        break
      }
      
      // Pausa entre scripts
      console.log('⏳ Aguardando 3 segundos...')
      await new Promise(resolve => setTimeout(resolve, 3000))
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message)
  } finally {
    // Desconectar
    await client.end()
    console.log('\n🎯 Execução finalizada!')
  }
}

main().catch(console.error)