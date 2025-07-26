
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Layout } from "@/components/Layout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  bio: z.string().max(160).optional(),
  role: z.string().optional(),
  department: z.string().optional(),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const defaultValues: Partial<ProfileFormValues> = {
  name: "João Silva",
  email: "joao.silva@prefeitura.gov.br",
  bio: "Analista de sistemas na Secretaria de Administração",
  role: "analista",
  department: "tecnologia",
  phone: "(11) 98765-4321",
};

const MeuPerfil = () => {
  const { toast } = useToast();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(data: ProfileFormValues) {
    toast({
      title: "Perfil atualizado",
      description: "Suas informações foram atualizadas com sucesso.",
    });
    console.log(data);
  }

  return (
    <Layout>
      <div className="mx-auto max-w-5xl p-4 md:p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Meu Perfil</h1>
            <p className="text-muted-foreground">
              Gerenciar suas informações pessoais e preferências de conta.
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="https://i.pravatar.cc/200" alt="Avatar" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="mb-1">Foto de Perfil</CardTitle>
                  <CardDescription>
                    Esta foto será exibida em seu perfil e em algumas áreas do sistema.
                  </CardDescription>
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" variant="outline">Alterar foto</Button>
                    <Button size="sm" variant="outline" className="text-destructive">Remover</Button>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Atualize suas informações de contato e identificação.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome completo</FormLabel>
                          <FormControl>
                            <Input placeholder="Seu nome" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="email@exemplo.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input placeholder="(00) 00000-0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cargo</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um cargo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="analista">Analista de Sistemas</SelectItem>
                              <SelectItem value="coordenador">Coordenador</SelectItem>
                              <SelectItem value="diretor">Diretor</SelectItem>
                              <SelectItem value="secretario">Secretário</SelectItem>
                              <SelectItem value="tecnico">Técnico Administrativo</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Departamento</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um departamento" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="administracao">Administração</SelectItem>
                              <SelectItem value="financas">Finanças</SelectItem>
                              <SelectItem value="tecnologia">Tecnologia</SelectItem>
                              <SelectItem value="saude">Saúde</SelectItem>
                              <SelectItem value="educacao">Educação</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Biografia</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Conte um pouco sobre você"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Breve descrição para seu perfil. Máximo 160 caracteres.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end">
                    <Button type="submit">Salvar alterações</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default MeuPerfil;
