import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Configuração da nova instância
const supabaseUrl = 'http://82.25.69.57:8162'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UtaW5zdGFuY2UtbWFuYWdlciIsImlhdCI6MTc1MzU4Mjg3NCwiZXhwIjoxNzg1MTE4ODc0fQ.xV1xg7zrNy1WIVyBo3p4pyEkqV7vFGkfcXahFsH4-6g'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function executeSQL(sqlContent, scriptName) {
  console.log(`\n🚀 Executando ${scriptName}...`)
  
  // Dividir o SQL em comandos individuais (por ';')
  const commands = sqlContent
    .split(';')
    .map(cmd => cmd.trim())
    .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'))
  
  console.log(`📝 Encontrados ${commands.length} comandos SQL`)
  
  for (let i = 0; i < commands.length; i++) {
    const command = commands[i]
    if (command.length < 5) continue // Pular comandos muito pequenos
    
    try {
      console.log(`   Executando comando ${i + 1}/${commands.length}...`)
      
      // Usar SQL direto via REST API
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey
        },
        body: JSON.stringify({
          sql: command
        })
      })
      
      if (!response.ok) {
        const error = await response.text()
        console.error(`❌ Erro no comando ${i + 1}:`, error)
        // Continue para o próximo comando ao invés de parar
        continue
      }
      
      const result = await response.text()
      if (result && result !== 'null') {
        console.log(`   ✅ Comando ${i + 1} executado`)
      }
      
    } catch (err) {
      console.error(`❌ Erro no comando ${i + 1}:`, err.message)
      // Continue para o próximo comando
      continue
    }
  }
  
  console.log(`✅ ${scriptName} processado!`)
  return true
}

async function main() {
  const scripts = [
    'sql/01_estrutura_base_nova_instancia.sql',
    'sql/02_dados_iniciais_nova_instancia.sql', 
    'sql/03_auth_supabase_nativo.sql'
  ]
  
  for (const scriptPath of scripts) {
    try {
      const sqlContent = fs.readFileSync(scriptPath, 'utf8')
      const scriptName = path.basename(scriptPath)
      
      const success = await executeSQL(sqlContent, scriptName)
      
      if (!success) {
        console.log(`❌ Parando execução devido ao erro em ${scriptName}`)
        break
      }
      
      // Pausa entre scripts
      await new Promise(resolve => setTimeout(resolve, 2000))
      
    } catch (err) {
      console.error(`❌ Erro lendo arquivo ${scriptPath}:`, err.message)
      break
    }
  }
  
  console.log('\n🎯 Execução dos scripts finalizada!')
}

main().catch(console.error)