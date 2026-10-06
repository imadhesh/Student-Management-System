import JSZip from 'jszip';
import { JAVA_PROJECT_FILES } from '../jdbc/javaCodeSnippets';

export async function exportJavaMavenZip() {
  const zip = new JSZip();

  // Root files
  zip.file('README.md', `# StudentSphere - Java JDBC & MySQL Student Management System

## Prerequisites
- Java Development Kit (JDK 17 or higher)
- Apache Maven 3.8+
- MySQL Server 8.0+

## Database Setup
1. Log in to your local MySQL CLI or MySQL Workbench:
   \`\`\`bash
   mysql -u root -p
   \`\`\`
2. Execute the schema script:
   \`\`\`sql
   source src/main/resources/schema.sql;
   \`\`\`
   Or run:
   \`\`\`bash
   mysql -u root -p < src/main/resources/schema.sql
   \`\`\`

## Configuration
Set environment variables or edit \`DBConnection.java\`:
- \`DB_URL\`: \`jdbc:mysql://localhost:3306/student_management_db?useSSL=false&serverTimezone=UTC\`
- \`DB_USER\`: \`root\`
- \`DB_PASSWORD\`: \`your_password\`

## Build and Run
\`\`\`bash
mvn clean compile
mvn exec:java -Dexec.mainClass="com.university.Main"
\`\`\`
`);

  // Add all project files
  JAVA_PROJECT_FILES.forEach(item => {
    zip.file(item.path, item.code);
  });

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'student-management-jdbc-mysql.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadSchemaSql() {
  const schemaFile = JAVA_PROJECT_FILES.find(f => f.filename === 'schema.sql');
  if (!schemaFile) return;

  const blob = new Blob([schemaFile.code], { type: 'text/sql' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'schema.sql';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
