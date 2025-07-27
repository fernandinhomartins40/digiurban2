import pg from 'pg'

const { Client } = pg

const client = new Client({
  connectionString: 'postgresql://postgres:QMr4iacgEJD0ROKu@82.25.69.57:5507/postgres'
})

async function checkDatabase() {
  try {
    await client.connect()
    console.log('✅ Conectado ao banco')
    
    // Verificar tabelas existentes
    console.log('\n📋 Tabelas existentes:')
    const tables = await client.query(`
      SELECT table_name, table_schema 
      FROM information_schema.tables 
      WHERE table_schema IN ('public', 'auth')
      ORDER BY table_schema, table_name
    `)
    
    tables.rows.forEach(row => {
      console.log(`   ${row.table_schema}.${row.table_name}`)
    })
    
    // Verificar tipos ENUM
    console.log('\n🏷️  Tipos ENUM existentes:')
    const enums = await client.query(`
      SELECT typname 
      FROM pg_type 
      WHERE typtype = 'e'
      ORDER BY typname
    `)
    
    enums.rows.forEach(row => {
      console.log(`   ${row.typname}`)
    })
    
    // Verificar se user_profiles existe e sua estrutura
    console.log('\n👤 Verificando user_profiles:')
    const userProfilesExists = await client.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'user_profiles' AND table_schema = 'public'
      )
    `)
    
    if (userProfilesExists.rows[0].exists) {
      console.log('   ✅ Tabela user_profiles existe')
      
      // Verificar colunas
      const columns = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'user_profiles' AND table_schema = 'public'
        ORDER BY ordinal_position
      `)
      
      console.log('   📊 Colunas:')
      columns.rows.forEach(col => {
        console.log(`      ${col.column_name} (${col.data_type}, ${col.is_nullable})`)
      })
    } else {
      console.log('   ❌ Tabela user_profiles não existe')
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  } finally {
    await client.end()
  }
}

checkDatabase().catch(console.error)